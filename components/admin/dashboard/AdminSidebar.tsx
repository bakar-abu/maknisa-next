"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { AdminUser } from "@/lib/admin-auth/types";
import { getNavItemsForRole, type AdminNavItem } from "@/lib/admin-navigation";
import { AdminNavIcon } from "./AdminNavIcon";

type AdminSidebarProps = {
  user: AdminUser;
};

function isActive(href: string, pathname: string): boolean {
  if (href === "/maknisa-admin/dashboard") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getNavItemsForRole(user.role);

  return (
    <>
      <button
        type="button"
        className="admin-dash__mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <AdminNavIcon name="menu" />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="admin-dash__backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`admin-dash__sidebar${expanded ? " is-expanded" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
        aria-label="Admin navigation"
      >
        <nav className="admin-dash__nav">
          {navItems.map((item: AdminNavItem) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`admin-dash__nav-btn${active ? " is-active" : ""}`}
                title={item.label}
                aria-label={item.label}
                onClick={() => setMobileOpen(false)}
              >
                <span className="admin-dash__nav-btn-icon" aria-hidden="true">
                  <AdminNavIcon name={item.icon} />
                </span>
                {expanded ? <span className="admin-dash__nav-label">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="admin-dash__nav-btn admin-dash__expand-btn"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <span className="admin-dash__nav-btn-icon" aria-hidden="true">
            <AdminNavIcon name="chevron-right" />
          </span>
        </button>
      </aside>
    </>
  );
}
