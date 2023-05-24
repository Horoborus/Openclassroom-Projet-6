require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/users.js");
const sauceRoute = require("./routes/sauce.js");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

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

// Configuration du rate limit
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 100, // 100 requêtes par heure
  message:
    "Trop de requêtes effectuées depuis cette adresse IP, veuillez réessayer plus tard.",
});

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

//Securité
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "style-src": ["'self'"],
      "img-src": ["*"], // Autorise les images de toutes les sources
      "font-src": ["'self'"],
    },
  })
);
app.use(limiter);
app.use(mongoSanitize());
app.use(xss());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoute);
app.use("/api/sauces", sauceRoute);
module.exports = app;
