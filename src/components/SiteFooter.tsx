"use client";

import { useI18n } from "@/components/LocaleProvider";
import { GlobeIcon } from "@/components/GlobeIcon";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="site-footer glass-surface">
      <span>{t("footer.brand")}</span>
      <span className="site-footer__center">{t("footer.center")}</span>
      <span className="site-footer__right">
        <span className="site-footer__right-text">{t("footer.right")}</span>
        <GlobeIcon />
      </span>
    </footer>
  );
}
