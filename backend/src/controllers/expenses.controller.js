const { createExpenseSchema } = require("../validators/expenses.validators");
const expensesService = require("../services/expenses.service");

async function createExpenseController(req, res, next) {
  try {
    const parsed = createExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Données invalides", errors: parsed.error.issues });
    }

    const { title, comment } = parsed.data;
    const report = await expensesService.createExpenseReport(req.user.userId, title, comment);

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

module.exports = { createExpenseController, getMyExpensesController, getExpenseByIdController };