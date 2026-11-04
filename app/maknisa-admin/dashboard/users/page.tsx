import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UsersOverview } from "@/components/admin/dashboard/UsersOverview";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { getAdminUser } from "@/lib/admin-auth/user";

export const metadata: Metadata = {
  title: "Users | Maknisa Admin",
};

export default async function UsersPage() {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  if (user.role !== "admin") {
    redirect("/maknisa-admin/dashboard");
  }

  return <UsersOverview user={user} />;
}
