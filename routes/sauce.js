const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const sauce = require("../controllers/sauce");
const upload = require("../middleware/upload");

//Routes Sauces
router.get("/", auth.auth, sauce.getSauces);
router.post("/", auth.auth, upload, sauce.createSauce);
router.get("/:id", auth.auth, sauce.getOneSauce);
router.put("/:id", auth.auth, upload, sauce.modifySauce);
router.delete("/:id", auth.auth, upload, sauce.deleteSauce);

module.exports = router;
