require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/users.js");

//variables d'environment
const password = process.env.DB_PASSWORD;
const username = process.env.DB_USER;
const database = process.env.DB_DATABASE;

// Connecter au MongoDB
const mongo = `mongodb+srv://${username}:${password}@cluster0.wwad9u3.mongodb.net/${database}`;

mongoose
  .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//config Header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

// function express
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "image")));
app.use("/api/auth", userRoute);

module.exports = app;
