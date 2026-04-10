const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// POST: Save onboarding form
router.post("/onboard", async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();

    res.status(201).json(savedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
