const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/learnflow")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.use("/api/session", sessionRoutes);

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
