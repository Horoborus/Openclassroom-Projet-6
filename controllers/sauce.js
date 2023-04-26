const Sauce = require("../models/sauce.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// fonction pour récupérer toutes les sauces
exports.getSauces = (req, res, next) => {
  Sauce
    .find()
    .then((sauces) => {
      res.status(200).json({ sauces });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

//Creer Nouvelle Sauce
exports.createSauce = (req, res, next) => {
  console.log("creation sauce")
  const sauceBody = JSON.parse(req.body.sauce)
  delete sauceBody._id
  const sauce = new Sauce({
    ...sauceBody,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.
  file.filename}`,
  likes: 0,
    dislikes: 0,
       usersLiked: [],
       usersDisliked: [],
  })
  sauce.save()
        .then(() =>{
          res.status(201).json({ message: "Sauce créée avec succès !" })
}).catch ((error)=> {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la création de la sauce",
    });
   })
  // try {
  //   upload.single("image")(req, res, (err) => {
  //     if (err instanceof multer.MulterError) {
  //       return res
  //         .status(400)
  //         .json({ message: "Erreur avec le fichier image" });
  //     } else if (err) {
  //       return res.status(400).json({ message: "Une erreur est survenue" });
  //     }
  //     const { userId, name, manufacturer, description, mainPepper, heat } =
  //       req.body;
  //     const imageUrl = req.file.path;
  //     const newSauce = new sauce({
  //       userId,
  //       name,
  //       manufacturer,
  //       description,
  //       mainPepper,
  //       heat,
  //       imageUrl,
  //       likes: 0,
  //       dislikes: 0,
  //       usersLiked: [],
  //       usersDisliked: [],
  //     });
  //     newSauce
  //       .save()
  //       .then(() =>
  //         res.status(201).json({ message: "Sauce créée avec succès !" })
  //       );
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({
  //     message: "Une erreur est survenue lors de la création de la sauce",
  //   });
  // }
};
// fonction pour récupérer toutes les sauces
exports.getOneSauce = (req, res, next) => {
  Sauce
    .findOne()
    .then((sauce) => {
      res.status(200).json({ sauce });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};