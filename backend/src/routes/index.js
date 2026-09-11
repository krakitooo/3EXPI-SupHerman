const express = require("express");
const authRoutes = require("./auth.routes");
const usersRoutes = require("./users.routes");
const expensesRoutes = require("./expenses.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/expenses", expensesRoutes);

module.exports = router;