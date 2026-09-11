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

async function getAllExpenseReports(requestingUser) {
  const where =
    requestingUser.role === "COMPTABILITE"
      ? { status: { in: ["VALIDEE", "TRAITEE"] } }
      : {};

  return prisma.expenseReport.findMany({
    where,
    orderBy: { submissionDate: "desc" },
    include: { user: { select: { email: true } } },
  });
}

async function updateExpenseStatus(id, newStatus, requestingUser) {
  const report = await prisma.expenseReport.findUnique({ where: { id } });

  if (!report) {
    throw { status: 404, message: "Note de frais introuvable" };
  }

  if (requestingUser.role === "MANAGER") {
    if (!["VALIDEE", "REFUSEE"].includes(newStatus)) {
      throw { status: 400, message: "Un manager ne peut que valider ou refuser" };
    }
    if (report.status !== "CREEE") {
      throw { status: 409, message: "Cette note a déjà été traitée par un manager" };
    }
    if (report.userId === requestingUser.userId) {
      throw { status: 403, message: "Vous ne pouvez pas valider votre propre note" };
    }
  }

  if (requestingUser.role === "COMPTABILITE") {
    if (newStatus !== "TRAITEE") {
      throw { status: 400, message: "La comptabilité ne peut que marquer comme traitée" };
    }
    if (report.status !== "VALIDEE") {
      throw { status: 409, message: "Seule une note validée peut être marquée comme traitée" };
    }
  }

  return prisma.expenseReport.update({
    where: { id },
    data: { status: newStatus },
  });
}

module.exports = {
  createExpenseReport,
  getMyExpenseReports,
  getExpenseReportById,
  getAttachmentFile,
  getAllExpenseReports,
  updateExpenseStatus,
};