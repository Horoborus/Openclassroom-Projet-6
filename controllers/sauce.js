const sauce = require("../models/sauce.js");

const upload = require("./middleware/upload");

// fonction pour récupérer toutes les sauces
exports.getSauces = (req, res, next) => {
  sauce
    .find()
    .then((sauces) => {
      res.status(200).json({ sauces });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Creer Nouvelle Sauce
exports.createSauce = (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Erreur avec le fichier image" });
    } else if (err) {
      return res.status(400).json({ message: "Une erreur est survenue" });
    }

    const newSauce = new sauce({
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat,
      imageUrl: req.file.path,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });

    newSauce
      .save()
      .then(() =>
        res.status(201).json({ message: "Sauce créée avec succès !" })
      )
      .catch((error) => res.status(400).json({ error }));
  });
};
