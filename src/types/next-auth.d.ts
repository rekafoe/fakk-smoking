import "next-auth";
import "next-auth/jwt";
import type { UserRole } from "@prisma/client";
import type { Locale } from "@/i18n";
import type { SupportedCurrency } from "@/lib/profile";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    quitDate?: string | null;
    cigarettesPerDay?: number | null;
    pricePerPack?: number | null;
    cigarettesPerPack?: number;
    currency?: SupportedCurrency;
    locale?: Locale;
  }
  interface Session {
    user: {
      id: string;
      role: UserRole;
      email?: string | null;
      name?: string | null;
      quitDate: string | null;
      cigarettesPerDay: number | null;
      pricePerPack: number | null;
      cigarettesPerPack: number;
      currency: SupportedCurrency;
      locale: Locale;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    quitDate?: string | null;
    cigarettesPerDay?: number | null;
    pricePerPack?: number | null;
    cigarettesPerPack?: number;
    currency?: SupportedCurrency;
    locale?: Locale;
  }
}
