import {
  AdminPageHeader,
  AdminWorkspaceToolbar,
} from "@/components/admin/dashboard/AdminPageHeader";
import type { AdminUser } from "@/lib/admin-auth/user";

type AdminPlaceholderSectionProps = {
  user: AdminUser;
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
};

export function AdminPlaceholderSection({
  user,
  title,
  description,
  breadcrumbs,
}: AdminPlaceholderSectionProps) {
  return (
    <div className="admin-dash__placeholder">
      <AdminPageHeader user={user} title={title} breadcrumbs={breadcrumbs} />
      <AdminWorkspaceToolbar activeView="overview" />
      <section className="admin-dash__placeholder-card">
        <h2>{title}</h2>
        <p>{description}</p>
      </section>
    </div>
  );
}
