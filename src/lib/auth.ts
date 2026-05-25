import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n";
import { PROFILE_SELECT, normalizeCurrency, profileFromDb } from "@/lib/profile";

async function loadProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: PROFILE_SELECT,
  });
  return user ? profileFromDb(user) : null;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: { ...PROFILE_SELECT, id: true, email: true, name: true, passwordHash: true },
        });
        if (!user) return null;
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        const { passwordHash: _pw, ...profileUser } = user;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          ...profileFromDb(profileUser),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.quitDate = user.quitDate ?? null;
        token.cigarettesPerDay = user.cigarettesPerDay ?? null;
        token.pricePerPack = user.pricePerPack ?? null;
        token.cigarettesPerPack = user.cigarettesPerPack ?? 20;
        token.currency = normalizeCurrency(user.currency ?? "PLN");
        token.locale = (user.locale as Locale | undefined) ?? "en";
        return token;
      }
      if (trigger === "update" && token.id) {
        const profile = await loadProfile(token.id as string);
        if (profile) Object.assign(token, profile);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.quitDate = (token.quitDate as string | null) ?? null;
        session.user.cigarettesPerDay = (token.cigarettesPerDay as number | null) ?? null;
        session.user.pricePerPack = (token.pricePerPack as number | null) ?? null;
        session.user.cigarettesPerPack = (token.cigarettesPerPack as number) ?? 20;
        session.user.currency = normalizeCurrency(token.currency ?? "PLN");
        session.user.locale = (token.locale as Locale) ?? "en";
      }
      return session;
    },
  },
};
