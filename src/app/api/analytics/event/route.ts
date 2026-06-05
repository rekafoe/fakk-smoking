import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ANALYTICS_EVENT,
  isAnalyticsEnabled,
  normalizePagePath,
  recordPageView,
  trackEvent,
} from "@/lib/analytics";
import { authOptions } from "@/lib/auth";

const VISITOR_COOKIE = "fs_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const bodySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("page_view"),
    path: z.string().min(1).max(200),
  }),
  z.object({
    kind: z.literal("emergency_open"),
  }),
]);

export async function POST(request: Request) {
  if (!isAnalyticsEnabled()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (parsed.data.kind === "emergency_open") {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await trackEvent(ANALYTICS_EVENT.EMERGENCY_OPEN, session.user.id);
    return NextResponse.json({ ok: true });
  }

  const path = normalizePagePath(parsed.data.path);
  if (!path) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  const setVisitorCookie = !visitorId;
  if (!visitorId) {
    visitorId = randomUUID();
  }

  await recordPageView({
    path,
    visitorId,
    userId: session?.user?.id ?? null,
  });

  const response = NextResponse.json({ ok: true });
  if (setVisitorCookie) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
  return response;
}
