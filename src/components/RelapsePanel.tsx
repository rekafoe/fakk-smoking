"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { pickEncouragingPhrase } from "@/lib/relapse";

type Step = "confirm" | "done";

export function RelapsePanel({
  open,
  onClose,
  onLogged,
}: {
  open: boolean;
  onClose: () => void;
  onLogged?: () => void;
}) {
  const { dict, t } = useI18n();
  const [step, setStep] = useState<Step>("confirm");
  const [note, setNote] = useState("");
  const [encouragement, setEncouragement] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("confirm");
    setNote("");
    setEncouragement("");
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "confirm") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  if (!open) return null;

  async function handleConfirm() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/relapse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("relapse.saveFailed"));
        return;
      }
      const phrase = pickEncouragingPhrase(
        dict.relapse.encouragement,
        data.totalCount as number,
      );
      setEncouragement(phrase);
      setStep("done");
      onLogged?.();
    } catch {
      setError(t("onboarding.networkError"));
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="relapse-done-title">
        <div className="modal-panel">
          <div className="modal-panel__header">
            <h2 id="relapse-done-title" className="modal-panel__title">
              {t("relapse.doneTitle")}
            </h2>
          </div>
          <blockquote className="relapse-encouragement">{encouragement}</blockquote>
          <p className="relapse-disclaimer">{t("relapse.counterUnchanged")}</p>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            {t("relapse.close")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="relapse-title">
      <div className="modal-panel">
        <div className="modal-panel__header">
          <h2 id="relapse-title" className="modal-panel__title">
            {t("relapse.title")}
          </h2>
          <button type="button" className="btn modal-panel__close" onClick={onClose}>
            {t("relapse.cancel")}
          </button>
        </div>

        <p className="relapse-disclaimer">{t("relapse.confirmHint")}</p>
        <p className="relapse-disclaimer relapse-disclaimer--emphasis">
          {t("relapse.noResetHint")}
        </p>

        <form
          className="onboarding-form"
          onSubmit={(e) => {
            e.preventDefault();
            void handleConfirm();
          }}
        >
          <label>
            {t("relapse.noteLabel")}
            <textarea
              className="relapse-note"
              rows={3}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("relapse.notePlaceholder")}
            />
          </label>
          {error ? <p className="auth-form__error">{error}</p> : null}
          <div className="relapse-actions">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              {t("relapse.cancel")}
            </button>
            <button type="submit" className="btn btn--danger" disabled={loading}>
              {loading ? t("relapse.saving") : t("relapse.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
