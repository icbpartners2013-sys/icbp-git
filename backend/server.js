const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

const clientRoutes = require("./routes/clientRoutes");

app.use("/api", clientRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
