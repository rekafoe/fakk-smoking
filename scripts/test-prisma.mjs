import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const users = await prisma.user.findMany({ take: 1 });
  console.log("users:", users);
  if (users[0]) {
    const updated = await prisma.user.update({
      where: { id: users[0].id },
      data: { locale: "pl" },
      select: {
        id: true,
        locale: true,
        currency: true,
        cigarettesPerDay: true,
        pricePerPack: true,
        cigarettesPerPack: true,
        quitDate: true,
      },
    });
    console.log("updated:", updated);
  }
} catch (e) {
  console.error("ERROR:", e);
} finally {
  await prisma.$disconnect();
}
