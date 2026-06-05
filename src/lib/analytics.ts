import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const ANALYTICS_EVENT = {
  REGISTER_SUCCESS: "register_success",
  LOGIN_SUCCESS: "login_success",
  EMERGENCY_OPEN: "emergency_open",
  RELAPSE_LOGGED: "relapse_logged",
} as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT)[keyof typeof ANALYTICS_EVENT];

const PUBLIC_PATHS = ["/login", "/register", "/admin"];

export function isAnalyticsEnabled(): boolean {
  return process.env.ANALYTICS_ENABLED !== "false";
}

function isAllowedPath(base: string): boolean {
  if (base === "/") return true;
  return PUBLIC_PATHS.some((p) => base === p || base.startsWith(`${p}/`));
}

export function normalizePagePath(path: string): string | null {
  if (!path.startsWith("/") || path.length > 200) return null;
  if (path.startsWith("/api") || path.startsWith("/_next")) return null;
  const base = path.split("?")[0] || "/";
  if (!isAllowedPath(base)) return null;
  return base;
}

export async function touchUserActivity(userId: string): Promise<void> {
  if (!isAnalyticsEnabled()) return;
  await prisma.user.update({
    where: { id: userId },
    data: { lastSeenAt: new Date() },
  });
}

export async function recordPageView(params: {
  path: string;
  visitorId: string;
  userId?: string | null;
}): Promise<void> {
  if (!isAnalyticsEnabled()) return;
  const path = normalizePagePath(params.path);
  if (!path) return;

  await prisma.$transaction([
    prisma.pageView.create({
      data: {
        path,
        visitorId: params.visitorId,
        userId: params.userId ?? null,
      },
    }),
    ...(params.userId ? [prisma.user.update({ where: { id: params.userId }, data: { lastSeenAt: new Date() } })] : []),
  ]);
}

export async function trackEvent(
  type: AnalyticsEventType,
  userId?: string | null,
  metadata?: Prisma.InputJsonValue,
): Promise<void> {
  if (!isAnalyticsEnabled()) return;

  await prisma.$transaction([
    prisma.analyticsEvent.create({
      data: {
        type,
        userId: userId ?? null,
        metadata: metadata ?? undefined,
      },
    }),
    ...(userId ? [prisma.user.update({ where: { id: userId }, data: { lastSeenAt: new Date() } })] : []),
  ]);
}
