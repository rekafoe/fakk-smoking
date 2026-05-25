import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const payloads = [
  { locale: "pl" },
  { cigarettesPerDay: 20, pricePerPack: 18, cigarettesPerPack: 20, currency: "PLN" },
  { cigarettesPerDay: 20, pricePerPack: 18, cigarettesPerPack: 20, currency: "RUB" },
  {},
];

try {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No users in DB");
    process.exit(0);
  }
  console.log("User id:", user.id, "currency:", user.currency);

  for (const data of payloads) {
    try {
      if (Object.keys(data).length === 0) {
        console.log("SKIP empty payload");
        continue;
      }
      const updated = await prisma.user.update({
        where: { id: user.id },
        data,
        select: { locale: true, currency: true },
      });
      console.log("OK", data, "->", updated);
    } catch (e) {
      console.log("FAIL", data, e.code, e.message?.slice(0, 200));
    }
  }

  try {
    await prisma.user.update({
      where: { id: "nonexistent-id-xxx" },
      data: { locale: "en" },
    });
  } catch (e) {
    console.log("Not found:", e.code, e.message?.slice(0, 120));
  }
} finally {
  await prisma.$disconnect();
}
