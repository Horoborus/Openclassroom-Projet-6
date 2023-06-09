// Variable de bcrypt
const bcrypt = require("bcrypt");

//variable de json web token
const webToken = require("jsonwebtoken");

//Recuparation de import model de user.js
const { User } = require("../models/user");

//Signup Utilisateur
exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  // Vérifiez si l'e-mail existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "L'email existe déjà" });
  }
  //Creation User data
  const userData = new User({ email, password: hashedPassword });
  try {
    await userData.save();
    res.send({ message: "Utilisateur enregistré" });
  } catch (err) {
    console.log("Utilisateur pas enregistré", err);
    res
      .status(500)
      .json({ message: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
};
//Function hash password avec bcrypt
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
//login up Utilisateur
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Vérifie si l'utilisateur existe
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).send({ message: "Utilisateur non trouvé" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(403).send({ message: "Mot de passe incorrect" });
  }

  const token = createToken(user._id);
  res.status(200).send({ userId: user._id, token: token });
};

function createToken(userId) {
  const tokenPassword = process.env.TOKEN_PASSWORD;
  return webToken.sign({ userId: userId }, tokenPassword, {
    expiresIn: "24h",
  });
}
