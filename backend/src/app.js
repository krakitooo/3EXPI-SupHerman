const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");
const routes = require("./routes");
const path = require("path");
const frontendPath = path.join(__dirname, "../../frontend/dist");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use(errorMiddleware);

app.use(express.static(frontendPath));

app.get("/*splat", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports = app;