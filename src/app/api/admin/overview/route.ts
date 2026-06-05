import { assertAdminApi } from "@/lib/admin";
import { getAdminOverview } from "@/lib/admin-stats";

export async function GET() {
  const auth = await assertAdminApi();
  if ("error" in auth) return auth.error;

  const overview = await getAdminOverview();
  return Response.json(overview);
}
