"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import type { RelapseEventDto } from "@/lib/relapse";

function formatOccurredAt(iso: string, locale: string): string {
  return new Date(iso).toLocaleString(locale === "pl" ? "pl-PL" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RelapseLog({ refreshKey }: { refreshKey?: number }) {
  const { locale, t } = useI18n();
  const [events, setEvents] = useState<RelapseEventDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/relapse")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setEvents((data.events as RelapseEventDto[]).slice(0, 3));
        setTotalCount(data.totalCount as number);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading && events.length === 0) {
    return <p className="relapse-disclaimer">{t("relapse.logLoading")}</p>;
  }

  if (totalCount === 0) {
    return null;
  }

  return (
    <section className="relapse-section" aria-labelledby="relapse-log-title">
      <h3 id="relapse-log-title" className="relapse-section__title">
        {t("relapse.logTitle")}
        <span className="relapse-section__badge">{totalCount}</span>
      </h3>
      <ul className="relapse-log">
        {events.map((event) => (
          <li key={event.id} className="relapse-log__item">
            <time className="relapse-log__date" dateTime={event.occurredAt}>
              {formatOccurredAt(event.occurredAt, locale)}
            </time>
            {event.note ? <p className="relapse-log__note">{event.note}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
