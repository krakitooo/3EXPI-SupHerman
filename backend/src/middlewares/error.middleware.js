const multer = require("multer");

function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    let message = "Erreur lors de l'upload du fichier";
    if (err.code === "LIMIT_FILE_SIZE") message = "Fichier trop volumineux (5 Mo maximum)";
    if (err.code === "LIMIT_FILE_COUNT") message = "Trop de fichiers (5 maximum)";
    return res.status(400).json({ message });
  }

  const status = err.status || 500;
  const message = err.message || "Erreur serveur";
  res.status(status).json({ message });
}

module.exports = errorMiddleware;