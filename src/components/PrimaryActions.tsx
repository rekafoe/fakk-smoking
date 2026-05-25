"use client";

import { useI18n } from "@/components/LocaleProvider";

type PrimaryActionsProps = {
  onEmergency: () => void;
  onRelapse: () => void;
};

export function PrimaryActions({ onEmergency, onRelapse }: PrimaryActionsProps) {
  const { t } = useI18n();

  return (
    <nav className="primary-actions" aria-label={t("dashboard.primaryActionsAria")}>
      <button type="button" className="btn btn--danger" onClick={onEmergency}>
        {t("dashboard.wantToSmoke")}
      </button>
      <button type="button" className="btn" onClick={onRelapse}>
        {t("dashboard.slipped")}
      </button>
    </nav>
  );
}
