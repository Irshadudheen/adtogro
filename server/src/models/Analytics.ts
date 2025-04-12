import mongoose, { model, Schema } from "mongoose";

const analyticsSchema = new Schema({
  urlId: {
    type: Schema.Types.ObjectId,
    ref: "Url",
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  ipAddress: String,
  country: String,
  city: String,
  osType: String,
  deviceType: String,
  browser: String,
  referrer: String,
  uniqueVisitorId: String
});

const Analytics = model('Analytics', analyticsSchema);

export default Analytics