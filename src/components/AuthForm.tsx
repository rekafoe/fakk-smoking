"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLightFlashes } from "@/components/BrandLightFlashes";
import { GlitchTitle } from "@/components/GlitchTitle";
import { useI18n } from "@/components/LocaleProvider";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : t("auth.registrationFailed"));
          return;
        }
      }
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(
          mode === "login" ? t("auth.invalidCredentials") : t("auth.signInAfterRegister"),
        );
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(t("auth.somethingWrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <BrandLightFlashes />
        <GlitchTitle />
      </div>
      <div className="auth-card glass-card">
        <h1>{mode === "login" ? t("auth.signIn") : t("auth.register")}</h1>
        <p>{mode === "login" ? t("auth.signInHint") : t("auth.registerHint")}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label>
              {t("auth.nameOptional")}
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          ) : null}
          <label>
            {t("auth.email")}
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            {t("auth.password")}
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="auth-form__error">{error}</p> : null}
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading
              ? t("auth.pleaseWait")
              : mode === "login"
                ? t("auth.signIn")
                : t("auth.register")}
          </button>
        </form>
        <p className="auth-card__switch">
          {mode === "login" ? (
            <>
              {t("auth.noAccount")}{" "}
              <Link href="/register">{t("auth.register")}</Link>
            </>
          ) : (
            <>
              {t("auth.hasAccount")} <Link href="/login">{t("auth.signIn")}</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
