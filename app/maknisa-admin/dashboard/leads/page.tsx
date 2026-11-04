import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LeadsOverview } from "@/components/admin/dashboard/LeadsOverview";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { getAdminUser } from "@/lib/admin-auth/user";

export const metadata: Metadata = {
  title: "Leads & Orders | Maknisa Admin",
};

export default async function LeadsPage() {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  if (user.role === "viewer") {
    redirect("/maknisa-admin/dashboard");
  }

  return <LeadsOverview user={user} />;
}
