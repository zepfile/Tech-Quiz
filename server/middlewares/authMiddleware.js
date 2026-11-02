const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "quiz_secret_jwt_key_2026";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        message: "You are not authenticated",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).send({
        message: "You are not authenticated",
        success: false,
      });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.body.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).send({
      message: "You are not authenticated",
      data: error,
      success: false,
    });
  }
};
