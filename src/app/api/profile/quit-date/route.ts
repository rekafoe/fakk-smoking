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
  const quitDate = new Date(parsed.data.quitDate + "T12:00:00");
  if (quitDate > new Date()) {
    return NextResponse.json({ error: "Quit date cannot be in the future" }, { status: 400 });
  }
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { quitDate },
    select: PROFILE_SELECT,
  });
  return NextResponse.json(profileFromDb(user));
}
