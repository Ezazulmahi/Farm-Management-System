import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../Model/app.js";

let mongod;
let app;

before(async () => {
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

const farmer = {
  name: "Rahim",
  email: "Rahim@Example.com",
  phoneNumber: "01700000000",
  address: "Bogura",
  password: "secret123",
  type: "farmer",
};

test("health endpoint answers", async () => {
  const res = await request(app).get("/api/test");
  assert.equal(res.status, 200);
});

test("signup hashes the password and login works", async () => {
  const signup = await request(app).post("/api/users/signup").send(farmer);
  assert.equal(signup.status, 201);

  const stored = await mongoose.connection.db.collection("users").findOne({ email: "rahim@example.com" });
  assert.notEqual(stored.password, farmer.password);

  const login = await request(app)
    .post("/api/users/login")
    .send({ email: "rahim@example.com", password: "secret123" });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.type, "farmer");
  assert.equal(login.body.user.password, undefined);
});

test("login does not reveal whether an email exists", async () => {
  await request(app).post("/api/users/signup").send(farmer);
  const unknown = await request(app).post("/api/users/login").send({ email: "nobody@example.com", password: "x" });
  const wrong = await request(app).post("/api/users/login").send({ email: farmer.email, password: "wrong-pass" });
  assert.equal(unknown.status, 401);
  assert.equal(wrong.status, 401);
});

test("signup refuses admin self registration and short passwords", async () => {
  const admin = await request(app).post("/api/users/signup").send({ ...farmer, type: "admin" });
  assert.equal(admin.status, 400);
  const short = await request(app).post("/api/users/signup").send({ ...farmer, password: "123" });
  assert.equal(short.status, 400);
});

test("duplicate email and phone are rejected", async () => {
  await request(app).post("/api/users/signup").send(farmer);
  const dupEmail = await request(app).post("/api/users/signup").send({ ...farmer, phoneNumber: "01811111111" });
  assert.equal(dupEmail.status, 409);
  const dupPhone = await request(app).post("/api/users/signup").send({ ...farmer, email: "other@example.com" });
  assert.equal(dupPhone.status, 409);
});

test("user list and update never return password hashes, and updates hash new passwords", async () => {
  await request(app).post("/api/users/signup").send(farmer);
  const list = await request(app).get("/api/users");
  assert.equal(list.status, 200);
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].password, undefined);

  const id = list.body[0]._id;
  const upd = await request(app).put(`/api/users/${id}`).send({ address: "Rajshahi", password: "newpass1", _id: "x" });
  assert.equal(upd.status, 200);
  assert.equal(upd.body.address, "Rajshahi");
  assert.equal(upd.body.password, undefined);

  const login = await request(app).post("/api/users/login").send({ email: farmer.email, password: "newpass1" });
  assert.equal(login.status, 200);
});

test("bad ids give 400 instead of crashing the server", async () => {
  const res = await request(app).put("/api/products/not-an-id").send({ name: "x" });
  assert.equal(res.status, 400);
  const after = await request(app).get("/api/test");
  assert.equal(after.status, 200);
});

test("products and farms CRUD", async () => {
  const created = await request(app).post("/api/products").send({ name: "Rice", price: 60, stock: 10 });
  assert.equal(created.status, 201);
  const list = await request(app).get("/api/products");
  assert.equal(list.body.length, 1);
  const invalid = await request(app).post("/api/products").send({ name: "No price" });
  assert.equal(invalid.status, 400);

  const farm = await request(app).post("/api/farms").send({ name: "BRAC Seed", image: "https://example.com/a.jpg" });
  assert.equal(farm.status, 201);
  const del = await request(app).delete(`/api/farms/${farm.body._id}`);
  assert.equal(del.status, 200);
});

test("weather reports a clear error when the API key is missing", async () => {
  const saved = process.env.WEATHER_API_KEY;
  delete process.env.WEATHER_API_KEY;
  const res = await request(app).get("/api/weather?city=Dhaka");
  assert.equal(res.status, 503);
  if (saved !== undefined) process.env.WEATHER_API_KEY = saved;
});

test("unknown routes return 404 JSON", async () => {
  const res = await request(app).get("/api/nope");
  assert.equal(res.status, 404);
});
