import { redirect } from "next/navigation";
import "@/app/styles/admin-dashboard.css";
import "@/app/styles/admin-content-builder.css";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { getAdminSession } from "@/lib/admin-auth/session";
import { getAdminUser } from "@/lib/admin-auth/user";

export default async function MaknisaAdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();

  if (!session.isAuthenticated) {
    if (session.hasRefreshToken) {
      redirect(
        `/api/admin/auth/refresh?next=${encodeURIComponent("/maknisa-admin/dashboard")}`,
      );
    }
    redirect(ADMIN_LOGIN_PATH);
  }

  const user = await getAdminUser();
  if (!user) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
