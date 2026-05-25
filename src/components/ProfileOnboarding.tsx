"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ProfileFormFields,
  profilePayloadFromForm,
  type ProfileFormValues,
} from "@/components/ProfileFormFields";
import { useI18n } from "@/components/LocaleProvider";
import { hasCompleteProfile, type ProfileSnapshot } from "@/lib/profile";

function emptyForm(): ProfileFormValues {
  return {
    quitDate: "",
    cigarettesPerDay: "20",
    pricePerPack: "",
    cigarettesPerPack: "20",
    currency: "PLN",
  };
}

function formFromSession(user: ProfileSnapshot): ProfileFormValues {
  return {
    quitDate: user.quitDate ? user.quitDate.slice(0, 10) : "",
    cigarettesPerDay: user.cigarettesPerDay?.toString() ?? "20",
    pricePerPack: user.pricePerPack?.toString() ?? "",
    cigarettesPerPack: user.cigarettesPerPack?.toString() ?? "20",
    currency: user.currency ?? "PLN",
  };
}

export function ProfileOnboarding() {
  const { data: session, update } = useSession();
  const { t } = useI18n();
  const [values, setValues] = useState<ProfileFormValues>(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) setValues(formFromSession(session.user));
  }, [session?.user]);

  if (!session?.user) return null;
  if (hasCompleteProfile(session.user)) return null;

  const needsQuitDate = !session.user.quitDate;
  const title = needsQuitDate ? t("onboarding.setupTitle") : t("onboarding.habitsTitle");
  const description = needsQuitDate ? t("onboarding.setupDesc") : t("onboarding.habitsDesc");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayloadFromForm(values, needsQuitDate)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("onboarding.saveFailed"));
        return;
      }
      await update(data);
    } catch {
      setError(t("onboarding.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card onboarding-card--wide glass-card">
        <h2>{title}</h2>
        <p>{description}</p>
        <form className="onboarding-form auth-form" onSubmit={handleSubmit}>
          <ProfileFormFields
            values={values}
            onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
            showQuitDate={needsQuitDate}
          />
          {error ? <p className="auth-form__error">{error}</p> : null}
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? t("onboarding.saving") : t("onboarding.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
