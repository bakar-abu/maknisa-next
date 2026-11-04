import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPlaceholderSection } from "@/components/admin/dashboard/AdminPlaceholderSection";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { getAdminUser } from "@/lib/admin-auth/user";

export const metadata: Metadata = {
  title: "Settings | Maknisa Admin",
};

export default async function SettingsPage() {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  return (
    <AdminPlaceholderSection
      user={user}
      title="Settings"
      description="Configure site metadata, contact details, navigation labels, and admin preferences."
      breadcrumbs={[
        { label: "Home", href: "/maknisa-admin/dashboard" },
        { label: "Settings" },
      ]}
    />
  );
}
