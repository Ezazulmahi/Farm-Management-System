import mongoose from "mongoose";

// One saved weather reading. The server fetches the values itself, so they always come from WeatherAPI.
const weatherLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    region: { type: String, trim: true, default: "" },
    condition: { type: String, trim: true, default: "" },
    icon: { type: String, trim: true, default: "" },
    tempC: { type: Number, required: true },
    feelsLikeC: { type: Number },
    humidity: { type: Number, min: 0, max: 100 },
    windKph: { type: Number, min: 0 },
    rainMm: { type: Number, min: 0 },
    chanceOfRain: { type: Number, min: 0, max: 100 },
    observedAt: { type: Date },
    note: { type: String, trim: true, maxlength: 300, default: "" },
  },
  { timestamps: true }
);

weatherLogSchema.index({ user: 1, createdAt: -1 });

const WeatherLog = mongoose.models.WeatherLog || mongoose.model("WeatherLog", weatherLogSchema);

export default WeatherLog;
