"use client";

import { useI18n } from "@/components/LocaleProvider";
import { getContentDayNumber, getDailyQuote } from "@/lib/daily-content";

export function DailyQuote({ days }: { days: number }) {
  const { t } = useI18n();
  const dayNumber = getContentDayNumber(days);
  const quote = getDailyQuote(days);

  return (
    <blockquote className="quote-block">
      <span className="quote-block__day">
        {t("daily.quoteEyebrow", { day: dayNumber })}
      </span>
      {quote}
    </blockquote>
  );
}
