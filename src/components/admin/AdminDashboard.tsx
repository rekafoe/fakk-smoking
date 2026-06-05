import Link from "next/link";
import type { AdminOverview, TimeseriesPoint } from "@/lib/admin-stats";
import styles from "./AdminDashboard.module.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PeriodBlock({
  label,
  stats,
}: {
  label: string;
  stats: AdminOverview["periods"]["today"];
}) {
  return (
    <div className={`glass-card glass-card--tile ${styles.card}`}>
      <p className={styles.cardLabel}>{label}</p>
      <div className={styles.statRow}>
        <span>Page views</span>
        <span className={styles.statValue}>{stats.pageViews}</span>
      </div>
      <div className={styles.statRow}>
        <span>Unique visitors</span>
        <span className={styles.statValue}>{stats.uniqueVisitors}</span>
      </div>
      <div className={styles.statRow}>
        <span>Registrations</span>
        <span className={styles.statValue}>{stats.registrations}</span>
      </div>
      <div className={styles.statRow}>
        <span>Active users</span>
        <span className={styles.statValue}>{stats.activeUsers}</span>
      </div>
      <div className={styles.statRow}>
        <span>Emergency opens</span>
        <span className={styles.statValue}>{stats.emergencyOpens}</span>
      </div>
      <div className={styles.statRow}>
        <span>Relapses logged</span>
        <span className={styles.statValue}>{stats.relapses}</span>
      </div>
    </div>
  );
}

function MiniChart({ points }: { points: TimeseriesPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className={styles.chart} role="img" aria-label="Page views last 14 days">
      {points.map((point) => (
        <div key={point.date} className={styles.barWrap}>
          <div
            className={styles.bar}
            style={{ height: `${Math.round((point.value / max) * 100)}%` }}
            title={`${point.date}: ${point.value}`}
          />
          <span className={styles.barLabel}>{point.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboard({
  overview,
  pageViewsSeries,
}: {
  overview: AdminOverview;
  pageViewsSeries: TimeseriesPoint[];
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin</h1>
          <p className={styles.subtitle}>Traffic and product analytics</p>
        </div>
        <Link href="/" className={styles.backLink}>
          Back to app
        </Link>
      </header>

      <div className={`glass-card glass-card--tile ${styles.card}`}>
        <p className={styles.cardLabel}>Users (all time)</p>
        <div className={styles.statRow}>
          <span>Total accounts</span>
          <span className={styles.statValue}>{overview.usersTotal}</span>
        </div>
        <div className={styles.statRow}>
          <span>With complete profile</span>
          <span className={styles.statValue}>{overview.usersWithProfile}</span>
        </div>
        <div className={styles.statRow}>
          <span>With quit date</span>
          <span className={styles.statValue}>{overview.usersWithQuitDate}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <PeriodBlock label="Today (UTC)" stats={overview.periods.today} />
        <PeriodBlock label="Last 7 days" stats={overview.periods["7d"]} />
        <PeriodBlock label="Last 30 days" stats={overview.periods["30d"]} />
      </div>

      <section className="glass-card glass-card--module">
        <h2 className={styles.sectionTitle}>Page views — last 14 days (UTC)</h2>
        <MiniChart points={pageViewsSeries} />
      </section>

      <section className="glass-card glass-card--module">
        <h2 className={styles.sectionTitle}>Recent registrations</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Registered</th>
                <th>Last seen</th>
                <th>Relapses</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {overview.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td className={styles.mono}>{formatDate(user.createdAt)}</td>
                  <td className={styles.mono}>
                    {user.lastSeenAt ? formatDate(user.lastSeenAt) : "—"}
                  </td>
                  <td className={styles.mono}>{user.relapseCount}</td>
                  <td>
                    <span
                      className={`${styles.badge}${user.role === "ADMIN" ? ` ${styles.badgeAdmin}` : ""}`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
