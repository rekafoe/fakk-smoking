import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PROFILE_SELECT, profileFromDb } from "@/lib/profile";

const schema = z.object({
  quitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** @deprecated Prefer PATCH /api/profile */
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
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
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { quitDate },
    select: PROFILE_SELECT,
  });
  return NextResponse.json(profileFromDb(user));
}
