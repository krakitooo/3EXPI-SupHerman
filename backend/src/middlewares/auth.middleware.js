const { verifyToken } = require("../utils/token");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = { requireAuth };