"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ProfileFormFields,
  profilePayloadFromForm,
  type ProfileFormValues,
} from "@/components/ProfileFormFields";
import { RelapseLog } from "@/components/RelapseLog";
import { useI18n } from "@/components/LocaleProvider";
import type { ProfileSnapshot } from "@/lib/profile";

function formFromSession(user: ProfileSnapshot): ProfileFormValues {
  return {
    quitDate: user.quitDate ? user.quitDate.slice(0, 10) : "",
    cigarettesPerDay: user.cigarettesPerDay?.toString() ?? "20",
    pricePerPack: user.pricePerPack?.toString() ?? "",
    cigarettesPerPack: user.cigarettesPerPack?.toString() ?? "20",
    currency: user.currency ?? "PLN",
  };
}

export function SettingsPanel({
  open,
  onClose,
  onSlipped,
  relapseLogKey,
}: {
  open: boolean;
  onClose: () => void;
  onSlipped?: () => void;
  relapseLogKey?: number;
}) {
  const { data: session, update } = useSession();
  const { t } = useI18n();
  const [values, setValues] = useState<ProfileFormValues | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && session?.user) {
      setValues(formFromSession(session.user));
      setError("");
    }
  }, [open, session?.user]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !values) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayloadFromForm(values, true)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("settings.saveFailed"));
        return;
      }
      await update(data);
      onClose();
    } catch {
      setError(t("onboarding.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="modal-panel glass-card">
        <div className="modal-panel__header">
          <h2 id="settings-title" className="modal-panel__title">
            {t("settings.title")}
          </h2>
          <button type="button" className="btn modal-panel__close" onClick={onClose}>
            {t("settings.close")}
          </button>
        </div>
        <RelapseLog refreshKey={relapseLogKey} />
        {onSlipped ? (
          <button type="button" className="btn btn--danger relapse-section__cta" onClick={onSlipped}>
            {t("settings.slipped")}
          </button>
        ) : null}
        <form className="onboarding-form auth-form" onSubmit={handleSubmit}>
          <ProfileFormFields
            values={values}
            onChange={(patch) => setValues((v) => (v ? { ...v, ...patch } : v))}
            showQuitDate
          />
          {error ? <p className="auth-form__error">{error}</p> : null}
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? t("settings.saving") : t("settings.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
