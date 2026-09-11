const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  createExpenseController,
  getMyExpensesController,
  getExpenseByIdController,
  downloadAttachmentController,
  getAllExpensesController,
  updateStatusController,
} = require("../controllers/expenses.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/", upload.array("attachments"), createExpenseController);
router.get("/mine", getMyExpensesController);
router.get("/all", requireRole("MANAGER", "COMPTABILITE"), getAllExpensesController);
router.patch("/:id/status", requireRole("MANAGER", "COMPTABILITE"), updateStatusController);
router.get("/:expenseId/attachments/:attachmentId", downloadAttachmentController);
router.get("/:id", getExpenseByIdController);

module.exports = router;