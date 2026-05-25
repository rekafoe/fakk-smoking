"use client";

import { LOCALES, type Locale } from "@/i18n";
import { useI18n } from "@/components/LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="lang-switcher" role="group" aria-label={t("language.label")}>
      {LOCALES.map((code, index) => (
        <span key={code} className="lang-switcher__item">
          {index > 0 ? <span className="lang-switcher__sep" aria-hidden="true" /> : null}
          <button
            type="button"
            className={`lang-switcher__btn${locale === code ? " lang-switcher__btn--active" : ""}`}
            onClick={() => setLocale(code as Locale)}
            aria-pressed={locale === code}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
