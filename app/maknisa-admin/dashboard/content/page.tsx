import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContentOverview } from "@/components/admin/dashboard/ContentOverview";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { getAdminUser } from "@/lib/admin-auth/user";

export const metadata: Metadata = {
  title: "Content | Maknisa Admin",
};

export default async function ContentPage() {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  return <ContentOverview user={user} />;
}
