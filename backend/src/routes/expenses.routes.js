const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  createExpenseController,
  getMyExpensesController,
  getExpenseByIdController,
  downloadAttachmentController,
} = require("../controllers/expenses.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/", upload.array("attachments"), createExpenseController);
router.get("/mine", getMyExpensesController);
router.get("/:expenseId/attachments/:attachmentId", downloadAttachmentController);
router.get("/:id", getExpenseByIdController);

module.exports = router;