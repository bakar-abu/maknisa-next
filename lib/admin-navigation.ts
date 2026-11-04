export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  icon: "dashboard" | "content" | "catalog" | "media" | "users" | "leads" | "settings";
  roles?: Array<"admin" | "editor" | "viewer">;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/maknisa-admin/dashboard",
    icon: "dashboard",
  },
  {
    id: "content",
    label: "Content",
    href: "/maknisa-admin/dashboard/content",
    icon: "content",
    roles: ["admin", "editor", "viewer"],
  },
  {
    id: "catalog",
    label: "Catalog",
    href: "/maknisa-admin/dashboard/catalog",
    icon: "catalog",
    roles: ["admin", "editor", "viewer"],
  },
  {
    id: "media",
    label: "Media",
    href: "/maknisa-admin/dashboard/media",
    icon: "media",
    roles: ["admin", "editor"],
  },
  {
    id: "leads",
    label: "Leads & Orders",
    href: "/maknisa-admin/dashboard/leads",
    icon: "leads",
    roles: ["admin", "editor"],
  },
  {
    id: "users",
    label: "Users",
    href: "/maknisa-admin/dashboard/users",
    icon: "users",
    roles: ["admin"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/maknisa-admin/dashboard/settings",
    icon: "settings",
    roles: ["admin", "editor"],
  },
];

export function getNavItemsForRole(role: string): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role as "admin" | "editor" | "viewer");
  });
}
