import type { AdminUser } from "@/lib/admin-auth/user";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  user: AdminUser;
  children: React.ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="admin-dash">
      <AdminSidebar user={user} />
      <div className="admin-dash__main">{children}</div>
    </div>
  );
}
