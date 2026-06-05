"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  getDictionary,
  replaceParams,
  type Dictionary,
  type Locale,
} from "@/i18n";

type I18nContextValue = {
  locale: Locale;
  dict: Dictionary;
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

export function LocaleProvider({ children }: { children: ReactNode }) {
  const dict = useMemo(() => getDictionary(DEFAULT_LOCALE), []);

  useEffect(() => {
    document.documentElement.lang = DEFAULT_LOCALE;
  }, []);

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
    () => ({ locale: DEFAULT_LOCALE, dict, t }),
    [dict, t],
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
