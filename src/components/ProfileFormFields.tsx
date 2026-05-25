"use client";

import { useI18n } from "@/components/LocaleProvider";

const CURRENCIES = [
  { code: "PLN", label: "zł PLN" },
  { code: "EUR", label: "€ EUR" },
] as const;

export type ProfileFormValues = {
  quitDate: string;
  cigarettesPerDay: string;
  pricePerPack: string;
  cigarettesPerPack: string;
  currency: string;
};

export function ProfileFormFields({
  values,
  onChange,
  showQuitDate = true,
}: {
  values: ProfileFormValues;
  onChange: (patch: Partial<ProfileFormValues>) => void;
  showQuitDate?: boolean;
}) {
  const { t } = useI18n();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      {showQuitDate ? (
        <label>
          {t("profileForm.quitDate")}
          <input
            type="date"
            required
            max={today}
            value={values.quitDate}
            onChange={(e) => onChange({ quitDate: e.target.value })}
          />
        </label>
      ) : null}
      <label>
        {t("profileForm.cigarettesPerDay")}
        <input
          type="number"
          required
          min={1}
          max={100}
          value={values.cigarettesPerDay}
          onChange={(e) => onChange({ cigarettesPerDay: e.target.value })}
        />
      </label>
      <label>
        {t("profileForm.pricePerPack")}
        <input
          type="number"
          required
          min={0.01}
          step={0.01}
          value={values.pricePerPack}
          onChange={(e) => onChange({ pricePerPack: e.target.value })}
        />
      </label>
      <label>
        {t("profileForm.cigarettesPerPack")}
        <input
          type="number"
          required
          min={1}
          max={50}
          value={values.cigarettesPerPack}
          onChange={(e) => onChange({ cigarettesPerPack: e.target.value })}
        />
      </label>
      <label>
        {t("profileForm.currency")}
        <select
          value={values.currency}
          onChange={(e) => onChange({ currency: e.target.value })}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

export function profilePayloadFromForm(values: ProfileFormValues, includeQuitDate: boolean) {
  const payload: Record<string, string | number> = {
    cigarettesPerDay: parseInt(values.cigarettesPerDay, 10),
    pricePerPack: parseFloat(values.pricePerPack),
    cigarettesPerPack: parseInt(values.cigarettesPerPack, 10),
    currency: values.currency,
  };
  if (includeQuitDate && values.quitDate) {
    payload.quitDate = values.quitDate;
  }
  return payload;
}
