const jwt = require("jsonwebtoken");
var containsPath = require("contains-path");

const { JWT_SECRET } = process.env;

const authenticateJWT = (req, res, next) => {
  // Exclude the login route from requiring a token
  return next()

  if (containsPath(req.path, "!api") || req.path === "/api/auth/login") {
    console.log("Excluding path from token verification:", req.path);
    return next();
  }
  const token = req.headers.authorization;

  if (token) {

    jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res
          .status(403)
          .json({ message: "Failed to authenticate token." });
      }
      console.log("Decoded token:", decoded);
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided." });
  }
};

module.exports = authenticateJWT;
