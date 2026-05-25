"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { DailyArticle } from "@/components/DailyArticle";
import { DailyQuote } from "@/components/DailyQuote";
import { DayCounter } from "@/components/DayCounter";
import { EmergencyPanel } from "@/components/EmergencyPanel";
import { RelapsePanel } from "@/components/RelapsePanel";
import { BrandLightFlashes } from "@/components/BrandLightFlashes";
import { GlitchTitle } from "@/components/GlitchTitle";
import { HealthProgress } from "@/components/HealthProgress";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/LocaleProvider";
import { ProfileOnboarding } from "@/components/ProfileOnboarding";
import { SettingsPanel } from "@/components/SettingsPanel";
import { CigaretteAccent } from "@/components/CigaretteAccent";
import { PrimaryActions } from "@/components/PrimaryActions";
import { SiteFooter } from "@/components/SiteFooter";
import { StatsPanel } from "@/components/StatsPanel";
import { daysWithoutNicotine, healingProgress } from "@/lib/healing";
import { hasCompleteProfile } from "@/lib/profile";

export function Dashboard() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [relapseOpen, setRelapseOpen] = useState(false);
  const [relapseLogKey, setRelapseLogKey] = useState(0);

  function openRelapsePanel() {
    setRelapseOpen(true);
  }

  function handleRelapseLogged() {
    setRelapseLogKey((k) => k + 1);
  }

  const quitDate = session?.user?.quitDate ? new Date(session.user.quitDate) : null;
  const days = quitDate ? daysWithoutNicotine(quitDate) : 0;
  const healing = quitDate ? healingProgress(quitDate) : { percent: 0, filledSegments: 0 };

  return (
    <div className="app-shell app-shell--dashboard">
      <CigaretteAccent />
      <div className="app-shell__content">
        <header className="dashboard-header">
          <div className="dashboard-header__brand">
            <BrandLightFlashes />
            <GlitchTitle />
          </div>
          <div className="dashboard-header__actions">
            <LanguageSwitcher />
            <button type="button" className="btn" onClick={() => setSettingsOpen(true)}>
              {t("dashboard.settings")}
            </button>
            <button type="button" className="btn" onClick={() => signOut({ callbackUrl: "/login" })}>
              {t("dashboard.signOut")}
            </button>
          </div>
        </header>

        <PrimaryActions
          onEmergency={() => setEmergencyOpen(true)}
          onRelapse={openRelapsePanel}
        />

        <main className="dashboard-main">
          <DayCounter days={days} />
          <aside className="dashboard-sidebar">
            {quitDate ? <DailyQuote days={days} /> : null}
            <HealthProgress
              percent={healing.percent}
              filledSegments={healing.filledSegments}
            />
          </aside>
        </main>

        {session?.user && hasCompleteProfile(session.user) ? (
          <StatsPanel profile={session.user} />
        ) : null}

        {quitDate ? <DailyArticle days={days} /> : null}
      </div>

      <SiteFooter />
      <ProfileOnboarding />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSlipped={() => {
          setSettingsOpen(false);
          openRelapsePanel();
        }}
        relapseLogKey={relapseLogKey}
      />
      <EmergencyPanel
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        days={days}
        onSlipped={() => {
          setEmergencyOpen(false);
          openRelapsePanel();
        }}
      />
      <RelapsePanel
        open={relapseOpen}
        onClose={() => setRelapseOpen(false)}
        onLogged={handleRelapseLogged}
      />
    </div>
  );
}
