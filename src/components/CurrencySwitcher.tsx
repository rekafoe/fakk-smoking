"use client";

import { useI18n } from "@/components/LocaleProvider";

const CURRENCIES = [
  { code: "PLN", label: "zł PLN" },
  { code: "EUR", label: "€ EUR" },
] as const;

export function CurrencySwitcher({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const { t } = useI18n();

  return (
    <div
      className="lang-switcher currency-switcher"
      role="group"
      aria-label={t("profileForm.currency")}
    >
      {CURRENCIES.map((c, index) => (
        <span key={c.code} className="lang-switcher__item">
          {index > 0 ? <span className="lang-switcher__sep" aria-hidden="true" /> : null}
          <button
            type="button"
            className={`lang-switcher__btn${value === c.code ? " lang-switcher__btn--active" : ""}`}
            onClick={() => onChange(c.code)}
            aria-pressed={value === c.code}
          >
            {c.label}
          </button>
        </span>
      ))}
    </div>
  );
}
