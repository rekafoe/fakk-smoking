import { UserRole } from "@prisma/client";
import { ANALYTICS_EVENT } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { hasCompleteProfile } from "@/lib/profile";

export type PeriodKey = "today" | "7d" | "30d";

function periodStart(key: PeriodKey, now = new Date()): Date {
  const d = new Date(now);
  if (key === "today") {
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - (key === "7d" ? 7 : 30));
  return d;
}

export type OverviewPeriodStats = {
  pageViews: number;
  uniqueVisitors: number;
  registrations: number;
  emergencyOpens: number;
  relapses: number;
  activeUsers: number;
};

export type AdminOverview = {
  usersTotal: number;
  usersWithProfile: number;
  usersWithQuitDate: number;
  periods: Record<PeriodKey, OverviewPeriodStats>;
  recentUsers: Array<{
    id: string;
    email: string;
    createdAt: string;
    lastSeenAt: string | null;
    role: UserRole;
    relapseCount: number;
  }>;
};

async function countUniqueVisitors(since: Date): Promise<number> {
  const rows = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT COALESCE("userId", "visitorId"))::bigint AS count
    FROM "PageView"
    WHERE "createdAt" >= ${since}
  `;
  return Number(rows[0]?.count ?? 0);
}

async function countActiveUsers(since: Date): Promise<number> {
  return prisma.user.count({
    where: { lastSeenAt: { gte: since } },
  });
}

async function statsForPeriod(since: Date): Promise<OverviewPeriodStats> {
  const [pageViews, uniqueVisitors, registrations, emergencyOpens, relapses, activeUsers] =
    await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      countUniqueVisitors(since),
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({
        where: { type: ANALYTICS_EVENT.EMERGENCY_OPEN, createdAt: { gte: since } },
      }),
      prisma.analyticsEvent.count({
        where: { type: ANALYTICS_EVENT.RELAPSE_LOGGED, createdAt: { gte: since } },
      }),
      countActiveUsers(since),
    ]);

  return {
    pageViews,
    uniqueVisitors,
    registrations,
    emergencyOpens,
    relapses,
    activeUsers,
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const now = new Date();
  const keys: PeriodKey[] = ["today", "7d", "30d"];
  const periodEntries = await Promise.all(
    keys.map(async (key) => [key, await statsForPeriod(periodStart(key, now))] as const),
  );

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      email: true,
      createdAt: true,
      lastSeenAt: true,
      role: true,
      quitDate: true,
      cigarettesPerDay: true,
      pricePerPack: true,
      _count: { select: { relapseEvents: true } },
    },
  });

  const allUsers = await prisma.user.findMany({
    select: {
      quitDate: true,
      cigarettesPerDay: true,
      pricePerPack: true,
      cigarettesPerPack: true,
      currency: true,
      locale: true,
    },
  });

  let usersWithProfile = 0;
  let usersWithQuitDate = 0;
  for (const u of allUsers) {
    if (u.quitDate) usersWithQuitDate += 1;
    if (
      hasCompleteProfile({
        quitDate: u.quitDate?.toISOString() ?? null,
        cigarettesPerDay: u.cigarettesPerDay,
        pricePerPack: u.pricePerPack,
        cigarettesPerPack: u.cigarettesPerPack,
        currency: u.currency as "PLN" | "EUR",
        locale: "en",
      })
    ) {
      usersWithProfile += 1;
    }
  }

  return {
    usersTotal: allUsers.length,
    usersWithProfile,
    usersWithQuitDate,
    periods: Object.fromEntries(periodEntries) as Record<PeriodKey, OverviewPeriodStats>,
    recentUsers: users.map((u) => ({
      id: u.id,
      email: u.email,
      createdAt: u.createdAt.toISOString(),
      lastSeenAt: u.lastSeenAt?.toISOString() ?? null,
      role: u.role,
      relapseCount: u._count.relapseEvents,
    })),
  };
}

export type TimeseriesMetric =
  | "registrations"
  | "page_views"
  | "unique_visitors"
  | "active_users";

export type TimeseriesPoint = { date: string; value: number };

export async function getAdminTimeseries(
  metric: TimeseriesMetric,
  days: number,
): Promise<TimeseriesPoint[]> {
  const safeDays = Math.min(90, Math.max(1, days));
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (safeDays - 1));

  if (metric === "registrations") {
    const rows = await prisma.$queryRaw<Array<{ day: Date; value: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS day, COUNT(*)::bigint AS value
      FROM "User"
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;
    return rows.map((r) => ({
      date: r.day.toISOString().slice(0, 10),
      value: Number(r.value),
    }));
  }

  if (metric === "page_views") {
    const rows = await prisma.$queryRaw<Array<{ day: Date; value: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS day, COUNT(*)::bigint AS value
      FROM "PageView"
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;
    return rows.map((r) => ({
      date: r.day.toISOString().slice(0, 10),
      value: Number(r.value),
    }));
  }

  if (metric === "unique_visitors") {
    const rows = await prisma.$queryRaw<Array<{ day: Date; value: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS day,
        COUNT(DISTINCT COALESCE("userId", "visitorId"))::bigint AS value
      FROM "PageView"
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;
    return rows.map((r) => ({
      date: r.day.toISOString().slice(0, 10),
      value: Number(r.value),
    }));
  }

  const rows = await prisma.$queryRaw<Array<{ day: Date; value: bigint }>>`
    SELECT DATE("lastSeenAt" AT TIME ZONE 'UTC') AS day, COUNT(*)::bigint AS value
    FROM "User"
    WHERE "lastSeenAt" >= ${since}
    GROUP BY day
    ORDER BY day ASC
  `;
  return rows.map((r) => ({
    date: r.day.toISOString().slice(0, 10),
    value: Number(r.value),
  }));
}

export async function getAdminUsers(page: number, limit: number) {
  const safeLimit = Math.min(50, Math.max(1, limit));
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * safeLimit;

  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastSeenAt: true,
        quitDate: true,
        cigarettesPerDay: true,
        pricePerPack: true,
        _count: { select: { relapseEvents: true, pageViews: true } },
      },
    }),
  ]);

  return {
    total,
    page: safePage,
    limit: safeLimit,
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      lastSeenAt: u.lastSeenAt?.toISOString() ?? null,
      quitDate: u.quitDate?.toISOString() ?? null,
      cigarettesPerDay: u.cigarettesPerDay,
      relapseCount: u._count.relapseEvents,
      pageViewCount: u._count.pageViews,
    })),
  };
}
