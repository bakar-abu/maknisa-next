"use client";

import type { AdminUser } from "@/lib/admin-auth/user";
import { AdminPageHeader } from "./AdminPageHeader";

type AdminWorkspaceLayoutProps = {
  user: AdminUser;
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
};

export function AdminWorkspaceLayout({
  user,
  title,
  breadcrumbs,
  children,
}: AdminWorkspaceLayoutProps) {
  return (
    <div className="admin-dash__workspace">
      <div className="admin-dash__workspace-head">
        <AdminPageHeader user={user} title={title} breadcrumbs={breadcrumbs} />
      </div>
      <div className="admin-dash__workspace-body">{children}</div>
    </div>
  );
}
