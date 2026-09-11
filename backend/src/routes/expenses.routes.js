const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware");
const {
  createExpenseController,
  getMyExpensesController,
  getExpenseByIdController,
} = require("../controllers/expenses.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/", createExpenseController);
router.get("/mine", getMyExpensesController);
router.get("/:id", getExpenseByIdController);

module.exports = router;