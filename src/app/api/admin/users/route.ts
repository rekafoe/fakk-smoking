import { assertAdminApi } from "@/lib/admin";
import { getAdminUsers } from "@/lib/admin-stats";

export async function GET(request: Request) {
  const auth = await assertAdminApi();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");

  const data = await getAdminUsers(page, limit);
  return Response.json(data);
}
