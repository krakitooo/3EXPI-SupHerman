const prisma = require("../config/prismaClient");

async function createExpenseReport(userId, title, comment) {
  return prisma.expenseReport.create({
    data: { title, comment, userId },
  });
}

async function getMyExpenseReports(userId) {
  return prisma.expenseReport.findMany({
    where: { userId },
    orderBy: { submissionDate: "desc" },
  });
}

async function getExpenseReportById(id, requestingUser) {
  const report = await prisma.expenseReport.findUnique({
    where: { id },
    include: {
      attachments: true,
      user: { select: { email: true } },
    },
  });

  if (!report) {
    throw { status: 404, message: "Note de frais introuvable" };
  }

  const isOwner = report.userId === requestingUser.userId;
  const isManagerOrCompta = ["MANAGER", "COMPTABILITE"].includes(requestingUser.role);

  if (!isOwner && !isManagerOrCompta) {
    throw { status: 403, message: "Accès refusé" };
  }

  return report;
}

module.exports = { createExpenseReport, getMyExpenseReports, getExpenseReportById };