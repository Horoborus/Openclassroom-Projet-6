//Variable de bcrypt
const bcrypt = require("bcrypt");

//variable de json web token
const webToken = require("jsonwebtoken");

//Recuparation de import model de user.js
const { User } = require("../models/user");

//Signup Utilisateur
exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  //Creation User data
  const userData = new User({ email, password: hashedPassword });
  userData
    .save()
    .then(() => res.send({ message: "Utilisateur Enregistré" }))
    .catch((err) => console.log("Utilisateur pas Enregistré", err));

  //Function hash password avec bcrypt
  async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
};

//login up Utilisateur
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Vérifie si l'utilisateur existe
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).send({ message: "Utilisateur non trouvé" });
  }

  // Vérifie si le mot de passe est correct
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(403).send({ message: "Mot de passe incorrect" });
  }

  const token = createToken(email);
  res.status(200).send({ userId: user._id, token: token });

  function createToken(email) {
    const tokenPassword = process.env.TOKEN_PASSWORD;
    return webToken.sign({ email: email }, tokenPassword, {
      expiresIn: "24h",
    });
  }
};
