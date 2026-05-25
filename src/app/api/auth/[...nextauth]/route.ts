import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/** Node runtime — keeps next-auth out of edge bundles (stable vendor chunks on Windows dev). */
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
