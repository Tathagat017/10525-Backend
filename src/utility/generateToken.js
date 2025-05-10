const jwt = require("jsonwebtoken");
const generateToken = (id, userName = null) => {
  return jwt.sign({ _id: id, name: userName }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
