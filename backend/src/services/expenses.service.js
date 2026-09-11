const prisma = require("../config/prismaClient");

async function createExpenseReport(userId, title, comment, files = []) {
  return prisma.expenseReport.create({
    data: {
      title,
      comment,
      userId,
      attachments: {
        create: files.map((file) => ({
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),
      },
    },
    include: { attachments: true },
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

async function getAttachmentFile(expenseId, attachmentId, requestingUser) {
  const attachment = await prisma.attachment.findFirst({
    where: { id: attachmentId, expenseReportId: expenseId },
    include: { expenseReport: { select: { userId: true } } },
  });

  if (!attachment) {
    throw { status: 404, message: "Pièce jointe introuvable" };
  }

  const isOwner = attachment.expenseReport.userId === requestingUser.userId;
  const isManagerOrCompta = ["MANAGER", "COMPTABILITE"].includes(requestingUser.role);

  if (!isOwner && !isManagerOrCompta) {
    throw { status: 403, message: "Accès refusé" };
  }

  return attachment;
}

module.exports = {
  createExpenseReport,
  getMyExpenseReports,
  getExpenseReportById,
  getAttachmentFile,
};