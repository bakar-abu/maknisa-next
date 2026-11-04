"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/lib/admin-auth/user";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-auth/constants";
import { AdminNavIcon } from "./AdminNavIcon";

type AdminPageHeaderProps = {
  user: AdminUser;
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
};

export function AdminPageHeader({
  title,
  breadcrumbs = [{ label: "Home", href: "/maknisa-admin/dashboard" }],
}: AdminPageHeaderProps) {
  const router = useRouter();
  const trail =
    breadcrumbs.length > 0
      ? breadcrumbs
      : [{ label: "Home", href: "/maknisa-admin/dashboard" }, { label: title }];

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push(ADMIN_LOGIN_PATH);
      router.refresh();
    }
  }

  return (
    <header className="admin-dash__page-header">
      <div className="admin-dash__page-header-left">
        <nav className="admin-dash__breadcrumbs" aria-label="Breadcrumb">
          {trail.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`}>
              {crumb.href && index < trail.length - 1 ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current={index === trail.length - 1 ? "page" : undefined}>
                  {crumb.label}
                </span>
              )}
              {index < trail.length - 1 ? <span className="admin-dash__crumb-sep">›</span> : null}
            </span>
          ))}
        </nav>
        <h1 className="admin-dash__page-title">{title}</h1>
      </div>

      <div className="admin-dash__page-header-right">
        <button
          type="button"
          className="admin-dash__btn admin-dash__btn--light admin-dash__logout-btn"
          onClick={() => void handleLogout()}
        >
          <AdminNavIcon name="log-out" />
          Logout
        </button>
      </div>
    </header>
  );
}

type AdminWorkspaceToolbarProps = {
  activeView?: "overview" | "list" | "activity";
  showActions?: boolean;
};

export function AdminWorkspaceToolbar({
  activeView = "list",
  showActions = true,
}: AdminWorkspaceToolbarProps) {
  const views = [
    { id: "overview" as const, label: "Overview" },
    { id: "list" as const, label: "List" },
    { id: "activity" as const, label: "Activity" },
  ];

  return (
    <div
      className={`admin-dash__toolbar${showActions ? "" : " admin-dash__toolbar--tabs-only"}`}
    >
      <div className="admin-dash__view-tabs" role="tablist" aria-label="Dashboard views">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={activeView === view.id}
            className={`admin-dash__view-tab${activeView === view.id ? " is-active" : ""}`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {showActions ? (
        <div className="admin-dash__toolbar-actions">
          <label className="admin-dash__search">
            <AdminNavIcon name="search" />
            <input type="search" placeholder="Search content, products, pages…" />
          </label>
          <button type="button" className="admin-dash__icon-btn" aria-label="Settings">
            <AdminNavIcon name="settings" />
          </button>
          <button type="button" className="admin-dash__icon-btn" aria-label="More options">
            <AdminNavIcon name="more" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
