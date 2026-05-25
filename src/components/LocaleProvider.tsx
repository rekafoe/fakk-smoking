"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import {
  DEFAULT_LOCALE,
  getDictionary,
  isLocale,
  replaceParams,
  type Dictionary,
  type Locale,
} from "@/i18n";

type I18nContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function resolvePath(dict: Dictionary, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: string | null;
}) {
  const { data: session, update } = useSession();
  const sessionLocale = session?.user?.locale;
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (sessionLocale && isLocale(sessionLocale)) return sessionLocale;
    if (initialLocale && isLocale(initialLocale)) return initialLocale;
    return DEFAULT_LOCALE;
  });

  const effectiveLocale =
    sessionLocale && isLocale(sessionLocale) ? sessionLocale : locale;

  const dict = useMemo(() => getDictionary(effectiveLocale), [effectiveLocale]);

  useEffect(() => {
    document.documentElement.lang = effectiveLocale;
  }, [effectiveLocale]);

  const setLocale = useCallback(
    async (next: Locale) => {
      setLocaleState(next);
      document.documentElement.lang = next;
      if (session?.user) {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
        if (res.ok) {
          const data = await res.json();
          await update(data);
        }
      }
    },
    [session?.user, update],
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const value = resolvePath(dict, key);
      if (typeof value === "string") {
        return params ? replaceParams(value, params) : value;
      }
      return key;
    },
    [dict],
  );

  const value = useMemo(
    () => ({ locale: effectiveLocale, dict, setLocale, t }),
    [effectiveLocale, dict, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return ctx;
}
