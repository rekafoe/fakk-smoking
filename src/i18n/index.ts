import { en, type Dictionary } from "@/i18n/locales/en";

export type { Dictionary };

export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return value === DEFAULT_LOCALE;
}

export function getDictionary(_locale: Locale = DEFAULT_LOCALE): Dictionary {
  return en;
}

export function replaceParams(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(params[key] ?? `{${key}}`),
  );
}
