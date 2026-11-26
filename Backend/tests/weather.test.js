import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../Model/app.js";
import { weatherClient } from "../Model/Routes/weatherRoutes.js";

let mongod;
let app;
let lastQuery;

const fakeForecast = (q) => ({
  location: { name: q.includes(",") ? "Bogura" : q, region: "Rajshahi", country: "Bangladesh" },
  current: {
    temp_c: 31.2,
    feelslike_c: 35.0,
    humidity: 70,
    wind_kph: 9.4,
    precip_mm: 0.1,
    last_updated_epoch: 1795600000,
    condition: { text: "Partly cloudy", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" },
  },
  forecast: { forecastday: [{ day: { daily_chance_of_rain: 64 } }] },
});

before(async () => {
  process.env.WEATHER_API_KEY = "test-key";
  weatherClient.forecast = async (q) => {
    lastQuery = q;
    if (q === "Atlantis") {
      const err = new Error("not found");
      err.response = { status: 400 };
      throw err;
    }
    return fakeForecast(q);
  };
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

async function signupAndLogin(type, email) {
  await request(app).post("/api/users/signup").send({
    name: "Test",
    email,
    phoneNumber: `017${Math.floor(Math.random() * 1e8).toString().padStart(8, "0")}`,
    address: "Bogura",
    password: "secret123",
    type,
  });
  const login = await request(app).post("/api/users/login").send({ email, password: "secret123" });
  return login.body.user.id;
}

test("GET /api/weather returns a summary and uses lat,lon when given", async () => {
  const byCity = await request(app).get("/api/weather?city=Sylhet");
  assert.equal(byCity.status, 200);
  assert.equal(byCity.body.summary.city, "Sylhet");
  assert.equal(byCity.body.summary.chanceOfRain, 64);
  assert.equal(byCity.body.summary.icon.startsWith("https://"), true);

  await request(app).get("/api/weather?lat=24.85&lon=89.37");
  assert.equal(lastQuery, "24.85,89.37");

  const missing = await request(app).get("/api/weather?city=Atlantis");
  assert.equal(missing.status, 404);
});

test("a farmer can save, list and delete their own weather readings", async () => {
  const farmerId = await signupAndLogin("farmer", "farmer@example.com");

  const saved = await request(app)
    .post("/api/weather/saved")
    .send({ userId: farmerId, city: "Bogura", note: "Sprayed urea", tempC: 99 });
  assert.equal(saved.status, 201);
  assert.equal(saved.body.city, "Bogura");
  assert.equal(saved.body.tempC, 31.2, "values come from the weather API, not the request body");
  assert.equal(saved.body.note, "Sprayed urea");

  await request(app).post("/api/weather/saved").send({ userId: farmerId, city: "Dhaka" });
  const list = await request(app).get(`/api/weather/saved?userId=${farmerId}`);
  assert.equal(list.status, 200);
  assert.equal(list.body.length, 2);
  assert.equal(list.body[0].city, "Dhaka", "newest first");

  const del = await request(app).delete(`/api/weather/saved/${saved.body._id}?userId=${farmerId}`);
  assert.equal(del.status, 200);
  const after = await request(app).get(`/api/weather/saved?userId=${farmerId}`);
  assert.equal(after.body.length, 1);
});

test("customers and anonymous visitors cannot save weather", async () => {
  const customerId = await signupAndLogin("customer", "customer@example.com");
  const asCustomer = await request(app).post("/api/weather/saved").send({ userId: customerId, city: "Dhaka" });
  assert.equal(asCustomer.status, 403);

  const anonymous = await request(app).post("/api/weather/saved").send({ city: "Dhaka" });
  assert.equal(anonymous.status, 401);

  const badId = await request(app).get("/api/weather/saved?userId=not-an-id");
  assert.equal(badId.status, 401);
});

test("a farmer cannot delete another farmer's reading", async () => {
  const a = await signupAndLogin("farmer", "a@example.com");
  const b = await signupAndLogin("farmer", "b@example.com");
  const saved = await request(app).post("/api/weather/saved").send({ userId: a, city: "Khulna" });

  const attempt = await request(app).delete(`/api/weather/saved/${saved.body._id}?userId=${b}`);
  assert.equal(attempt.status, 404);
  const stillThere = await request(app).get(`/api/weather/saved?userId=${a}`);
  assert.equal(stillThere.body.length, 1);
});

test("saving an unknown city returns 404 and stores nothing", async () => {
  const farmerId = await signupAndLogin("farmer", "f2@example.com");
  const res = await request(app).post("/api/weather/saved").send({ userId: farmerId, city: "Atlantis" });
  assert.equal(res.status, 404);
  const list = await request(app).get(`/api/weather/saved?userId=${farmerId}`);
  assert.equal(list.body.length, 0);
});
