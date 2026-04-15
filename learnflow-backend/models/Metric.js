const mongoose = require("mongoose");

const MetricSchema = new mongoose.Schema({
  sessionId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  eyeContact: Number,
  blinkRate: Number,
  headPose: Number,
  emotion: String,
  engagementState: String,
});

module.exports = mongoose.model("Metric", MetricSchema);