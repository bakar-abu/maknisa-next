import { redirect } from "next/navigation";
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
} from "@/lib/admin-auth/constants";
import { getAdminSession } from "@/lib/admin-auth/session";

export default async function MaknisaAdminEntryPage() {
  const session = await getAdminSession();

  if (session.isAuthenticated) {
    redirect(ADMIN_DASHBOARD_PATH);
  }

  if (session.hasRefreshToken) {
    redirect(
      `/api/admin/auth/refresh?next=${encodeURIComponent(ADMIN_DASHBOARD_PATH)}`,
    );
  }

  redirect(ADMIN_LOGIN_PATH);
}
