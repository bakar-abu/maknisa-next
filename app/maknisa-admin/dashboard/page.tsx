import type { Metadata } from "next";
import { DashboardOverview } from "@/components/admin/dashboard/DashboardOverview";
import { getAdminUser } from "@/lib/admin-auth/user";
import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";

export const metadata: Metadata = {
  title: "Dashboard | Maknisa Admin",
};

export default async function MaknisaAdminDashboardPage() {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  return <DashboardOverview user={user} />;
}
