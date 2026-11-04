import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CatalogOverview } from "@/components/admin/catalog/CatalogOverview";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { getAdminUser } from "@/lib/admin-auth/user";

export const metadata: Metadata = {
  title: "Catalog | Maknisa Admin",
};

export default async function CatalogPage() {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  return <CatalogOverview user={user} />;
}
