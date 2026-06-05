"use client";

import { useI18n } from "@/components/LocaleProvider";
import { getContentDayNumber, getDailyArticle } from "@/lib/daily-content";

export function DailyArticle({ days }: { days: number }) {
  const { t } = useI18n();
  const article = getDailyArticle(days);
  const dayNumber = getContentDayNumber(days);

  return (
    <article className="glass-card daily-article" aria-labelledby="daily-article-title">
      <header className="daily-article__header">
        <p className="daily-article__eyebrow">
          {t("daily.articleEyebrow", { day: dayNumber })}
        </p>
        <h2 id="daily-article-title" className="daily-article__title">
          {article.title}
        </h2>
        <p className="daily-article__excerpt">{article.excerpt}</p>
      </header>
      <div className="daily-article__body">
        {article.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
