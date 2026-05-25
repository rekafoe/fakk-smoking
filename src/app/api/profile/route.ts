import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isLocale } from "@/i18n";
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
  locale: z.enum(["en", "pl"]).optional(),
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
    locale?: string;
  } = {};

  if (parsed.data.quitDate !== undefined) {
    const quitDate = new Date(parsed.data.quitDate + "T12:00:00");
    if (quitDate > new Date()) {
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
  if (parsed.data.locale !== undefined && isLocale(parsed.data.locale)) {
    data.locale = parsed.data.locale;
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: PROFILE_SELECT,
  });

  return NextResponse.json(profileFromDb(user));
}
