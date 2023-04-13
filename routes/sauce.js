const express = require("express");

const router = express.Router();

const sauce = require("../controllers/sauce");

//Routes Sauces
router.get("/sauces", controllers.getSauce);
router.post("/sauces", auth, controllers.getSauce);

module.exports = router;
