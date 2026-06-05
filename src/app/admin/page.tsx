import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdminPage } from "@/lib/admin";
import { getAdminOverview, getAdminTimeseries } from "@/lib/admin-stats";

export default async function AdminPage() {
  await requireAdminPage();

  const [overview, pageViewsSeries] = await Promise.all([
    getAdminOverview(),
    getAdminTimeseries("page_views", 14),
  ]);

  return <AdminDashboard overview={overview} pageViewsSeries={pageViewsSeries} />;
}
