const webToken = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.header("Authorization");
  const identification = header.split(" ")[1];

  if (!identification) {
    res.status(403).send({ message: "identification invalide" });
  }
  webToken.verify(
    identification,
    process.env.TOKEN_PASSWORD,
    (err, decoded) => {
      if (err) res.status(403).send({ message: "Token invalide" + err });
      console.log("Token est bien valide, on continue");
      next();
    }
  );
}

module.exports = { auth };
