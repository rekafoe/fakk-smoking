import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PROFILE_SELECT, profileFromDb } from "@/lib/profile";

const patchSchema = z.object({
  quitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  cigarettesPerDay: z.number().int().min(1).max(100).optional(),
  pricePerPack: z.number().min(0.01).max(1_000_000).optional(),
  cigarettesPerPack: z.number().int().min(1).max(50).optional(),
  currency: z.enum(["PLN", "EUR"]).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: PROFILE_SELECT,
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(profileFromDb(user));
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const data: {
    quitDate?: Date;
    cigarettesPerDay?: number;
    pricePerPack?: number;
    cigarettesPerPack?: number;
    currency?: string;
  } = {};

  if (parsed.data.quitDate !== undefined) {
    const [y, m, d] = parsed.data.quitDate.split("-").map(Number);
    const quitDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const todayUtc = new Date();
    const todayNoon = Date.UTC(
      todayUtc.getUTCFullYear(),
      todayUtc.getUTCMonth(),
      todayUtc.getUTCDate(),
      12,
      0,
      0,
    );
    if (quitDate.getTime() > todayNoon) {
      return NextResponse.json({ error: "Quit date cannot be in the future" }, { status: 400 });
    }
    data.quitDate = quitDate;
  }
  if (parsed.data.cigarettesPerDay !== undefined) {
    data.cigarettesPerDay = parsed.data.cigarettesPerDay;
  }
  if (parsed.data.pricePerPack !== undefined) {
    data.pricePerPack = parsed.data.pricePerPack;
  }
  if (parsed.data.cigarettesPerPack !== undefined) {
    data.cigarettesPerPack = parsed.data.cigarettesPerPack;
  }
  if (parsed.data.currency !== undefined) {
    data.currency = parsed.data.currency.toUpperCase();
  }
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: PROFILE_SELECT,
  });

  return NextResponse.json(profileFromDb(user));
}
