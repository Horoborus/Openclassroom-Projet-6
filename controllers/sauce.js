const Sauce = require("../models/sauce.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const user = require("../models/user.js");
const fs = require("fs");

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
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Modifier Sauce
exports.modifySauce = (req, res, next) => {
  // const sauceBody = JSON.parse(req.body.sauce);
  const sauceBody = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // delete sauceBody._id;
  delete sauceBody._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(sauce.userId);
      console.log(req.auth);
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({
          message: "l'utilisateur n'pas autorisée a modifiée la sauce !",
        });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceBody, _id: req.params.id }
        )
          .then(() => {
            res.status(200).json({ mensage: "la sauce a ete modifiée" });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      }
      // res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Supprimer Sauce

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // if (error) {
        //   return res.status(500).json({ error });
        // }
        // console.log(error)
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Objet supprimé !" });
          })
          .catch((error) => res.status(500).json({ error }));
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "ne trouve pas" });
    });
};
//Function Like Sauce
//Function Like Sauce
exports.likeSauce = (req, res, next) => {
  const { userId, like } = req.body;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }

      // Update the like status using the setLikeStatus function
      setLikeStatus(userId, like, sauce);

      sauce
        .save()
        .then(() => {
          res.status(200).json({ message: "Sauce liked successfully" });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Function to set the like status for a user
function setLikeStatus(userId, like, sauce) {
  const currentLike = sauce.usersLiked.includes(userId)
    ? 1
    : sauce.usersDisliked.includes(userId)
    ? -1
    : 0;

  if (like === 1) {
    if (currentLike !== 1) {
      // Update the like status
      sauce.usersLiked.push(userId);
      // Remove user from the dislike array if they had previously disliked the sauce
      const index = sauce.usersDisliked.indexOf(userId);
      if (index !== -1) {
        sauce.usersDisliked.splice(index, 1);
      }
      sauce.likes += 1;
    }
  } else if (like === 0) {
    if (currentLike !== 0) {
      // Remove user from the like array if they had previously liked the sauce
      const index = sauce.usersLiked.indexOf(userId);
      if (index !== -1) {
        sauce.usersLiked.splice(index, 1);
      }
      // Remove user from the dislike array if they had previously disliked the sauce
      const dislikeIndex = sauce.usersDisliked.indexOf(userId);
      if (dislikeIndex !== -1) {
        sauce.usersDisliked.splice(dislikeIndex, 1);
      }
      if (currentLike === 1) {
        sauce.likes -= 1;
      } else if (currentLike === -1) {
        sauce.dislikes -= 1;
      }
    }
  } else if (like === -1) {
    if (currentLike !== -1) {
      // Update the like status
      sauce.usersDisliked.push(userId);
      // Remove user from the like array if they had previously liked the sauce
      const index = sauce.usersLiked.indexOf(userId);
      if (index !== -1) {
        sauce.usersLiked.splice(index, 1);
      }
      sauce.dislikes += 1;
    }
  }
}
