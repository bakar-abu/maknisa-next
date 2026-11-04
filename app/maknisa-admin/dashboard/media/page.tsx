import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MediaOverview } from "@/components/admin/dashboard/MediaOverview";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { getAdminUser } from "@/lib/admin-auth/user";

export const metadata: Metadata = {
  title: "Media | Maknisa Admin",
};

export default async function MediaPage() {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  return <MediaOverview user={user} />;
}
