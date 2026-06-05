import { DEFAULT_LOCALE, type Locale } from "@/i18n";

export const SUPPORTED_CURRENCIES = ["PLN", "EUR"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const PROFILE_SELECT = {
  quitDate: true,
  cigarettesPerDay: true,
  pricePerPack: true,
  cigarettesPerPack: true,
  currency: true,
  locale: true,
} as const;

export type ProfileSnapshot = {
  quitDate: string | null;
  cigarettesPerDay: number | null;
  pricePerPack: number | null;
  cigarettesPerPack: number;
  currency: SupportedCurrency;
  locale: Locale;
};

export function normalizeCurrency(currency: string): SupportedCurrency {
  return currency === "EUR" ? "EUR" : "PLN";
}

export function profileFromDb(user: {
  quitDate: Date | null;
  cigarettesPerDay: number | null;
  pricePerPack: number | null;
  cigarettesPerPack: number;
  currency: string;
  locale: string;
}): ProfileSnapshot {
  return {
    quitDate: user.quitDate?.toISOString() ?? null,
    cigarettesPerDay: user.cigarettesPerDay,
    pricePerPack: user.pricePerPack,
    cigarettesPerPack: user.cigarettesPerPack,
    currency: normalizeCurrency(user.currency),
    locale: DEFAULT_LOCALE,
  };
}

/** Session user fields used for stats and profile checks. */
export type SessionProfileFields = ProfileSnapshot;

export function hasCompleteProfile(profile: SessionProfileFields): boolean {
  return Boolean(
    profile.quitDate &&
      profile.cigarettesPerDay != null &&
      profile.cigarettesPerDay > 0 &&
      profile.pricePerPack != null &&
      profile.pricePerPack > 0,
  );
}

export function needsCurrencyMigration(currency: string): boolean {
  return !SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency);
}
