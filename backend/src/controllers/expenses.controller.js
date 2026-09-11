const path = require("path");
const { createExpenseSchema } = require("../validators/expenses.validators");
const expensesService = require("../services/expenses.service");

async function createExpenseController(req, res, next) {
    try {
        const parsed = createExpenseSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
        }

        const { title, comment } = parsed.data;
        const files = req.files || [];
        const report = await expensesService.createExpenseReport(req.user.userId, title, comment, files);

        res.status(201).json(report);
    } catch (err) {
        next(err);
    }
}

async function getMyExpensesController(req, res, next) {
    try {
        const reports = await expensesService.getMyExpenseReports(req.user.userId);
        res.json(reports);
    } catch (err) {
        next(err);
    }
}

async function getExpenseByIdController(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "Identifiant invalide" });
        }
        const report = await expensesService.getExpenseReportById(id, req.user);
        res.json(report);
    } catch (err) {
        next(err);
    }
}

async function downloadAttachmentController(req, res, next) {
    try {
        const expenseId = Number(req.params.expenseId);
        const attachmentId = Number(req.params.attachmentId);
        if (Number.isNaN(expenseId) || Number.isNaN(attachmentId)) {
            return res.status(400).json({ message: "Identifiant invalide" });
        }

        const attachment = await expensesService.getAttachmentFile(expenseId, attachmentId, req.user);
        const filePath = path.join(__dirname, "../../uploads", attachment.storedName);

        res.download(filePath, attachment.originalName);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createExpenseController,
    getMyExpensesController,
    getExpenseByIdController,
    downloadAttachmentController,
};