const Sauce = require("../models/sauce.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// fonction pour récupérer toutes les sauces
exports.getSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

//Creer Nouvelle Sauce
exports.createSauce = (req, res, next) => {
  const sauceBody = JSON.parse(req.body.sauce);
  delete sauceBody._id;
  const sauce = new Sauce({
    ...sauceBody,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce créée avec succès !" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Une erreur est survenue lors de la création de la sauce",
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Modifier Sauce
exports.modifySauce = (req, res, next) => {
  const sauceBody = JSON.parse(req.body.sauce);
  delete sauceBody._id;
  const sauce = new Sauce({
    ...sauceBody,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  Sauce.updateOne({ _id: req.params.id })
    .then(() => {
      res.status(201).json({
        message: "Sauce modifiée avec succès!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Supprimer Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
