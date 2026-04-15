const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },

  emotion: String,

  eyeContact: Number,
  blinkRate: Number,
  headPose: Number,

  faceVisible: Boolean,
});

module.exports = mongoose.model("Session", SessionSchema);

