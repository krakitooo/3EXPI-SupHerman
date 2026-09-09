const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = "manager@supherman.com";
  const plainPassword = "Suph3rm4n!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Compte manager déjà présent.");
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "MANAGER",
    },
  });

  console.log(`Compte manager créé : ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });