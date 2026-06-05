import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserRole(userId: string): Promise<UserRole> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? UserRole.USER;
}

export async function isAdminUser(userId: string): Promise<boolean> {
  return (await getUserRole(userId)) === UserRole.ADMIN;
}

/** Returns session if caller is admin; otherwise null. */
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (!(await isAdminUser(session.user.id))) return null;
  return session;
}

/** Server pages: redirect non-admins to dashboard. */
export async function requireAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }
  if (!(await isAdminUser(session.user.id))) {
    redirect("/");
  }
  return session;
}

export function adminForbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function adminUnauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** API routes: session required + ADMIN role from DB. */
export async function assertAdminApi() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: adminUnauthorizedResponse() as NextResponse };
  }
  if (!(await isAdminUser(session.user.id))) {
    return { error: adminForbiddenResponse() as NextResponse };
  }
  return { session };
}
