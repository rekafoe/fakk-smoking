import { assertAdminApi } from "@/lib/admin";
import { getAdminTimeseries, type TimeseriesMetric } from "@/lib/admin-stats";

const METRICS: TimeseriesMetric[] = [
  "registrations",
  "page_views",
  "unique_visitors",
  "active_users",
];

export async function GET(request: Request) {
  const auth = await assertAdminApi();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const metric = searchParams.get("metric") as TimeseriesMetric;
  const days = Number(searchParams.get("days") ?? "14");

  if (!METRICS.includes(metric)) {
    return Response.json({ error: "Invalid metric" }, { status: 400 });
  }

  const points = await getAdminTimeseries(metric, days);
  return Response.json({ metric, days, points });
}
