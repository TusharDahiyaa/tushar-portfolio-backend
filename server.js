require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = process.env.port || 8080;
const newUser = require(path.join(__dirname, "./controllers/user.controller"));

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/userMessage", newUser.saveUserMessage);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
