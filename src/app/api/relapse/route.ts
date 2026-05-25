import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { relapseFromDb } from "@/lib/relapse";

const NOTE_MAX = 500;
const LIST_LIMIT = 20;

const postSchema = z.object({
  note: z.string().trim().max(NOTE_MAX).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [events, totalCount] = await Promise.all([
    prisma.relapseEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { occurredAt: "desc" },
      take: LIST_LIMIT,
      select: { id: true, occurredAt: true, note: true },
    }),
    prisma.relapseEvent.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({
    events: events.map(relapseFromDb),
    totalCount,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const note = parsed.data.note?.length ? parsed.data.note : null;

  const [event, totalCount] = await prisma.$transaction([
    prisma.relapseEvent.create({
      data: {
        userId: session.user.id,
        note,
      },
      select: { id: true, occurredAt: true, note: true },
    }),
    prisma.relapseEvent.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({
    event: relapseFromDb(event),
    totalCount,
  });
}
