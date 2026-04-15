const express = require("express");
const router = express.Router();
const Session = require("../models/session");

// Save session metrics
router.post("/log", async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json({ message: "Session logged" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions (for demo)
router.get("/all", async (req, res) => {
  const sessions = await Session.find().sort({ timestamp: -1 });
  res.json(sessions);
});

module.exports = router;
