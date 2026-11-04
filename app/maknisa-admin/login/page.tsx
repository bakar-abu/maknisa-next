import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { ADMIN_DASHBOARD_PATH } from "@/lib/admin-auth/constants";
import { getAdminSession } from "@/lib/admin-auth/session";

export const metadata: Metadata = {
  title: "Sign in | Maknisa Admin",
  robots: { index: false, follow: false },
};

export default async function MaknisaAdminLoginPage() {
  const session = await getAdminSession();

  if (session.isAuthenticated) {
    redirect(ADMIN_DASHBOARD_PATH);
  }

  if (session.hasRefreshToken) {
    redirect(
      `/api/admin/auth/refresh?next=${encodeURIComponent(ADMIN_DASHBOARD_PATH)}`,
    );
  }

  return <AdminLoginForm />;
}
