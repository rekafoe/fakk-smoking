import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ANALYTICS_EVENT, trackEvent } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(64).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const email = parsed.data.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const passwordHash = await hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: parsed.data.name?.trim(),
      },
    });
    await trackEvent(ANALYTICS_EVENT.REGISTER_SUCCESS, user.id);
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
