"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUser } from "@/lib/admin-auth/user";
import { getAdminContentTabs } from "@/lib/admin-content-pages";
import {
  customerName,
  formatLeadDate,
  formatProductOrderSummary,
  type AppointmentSubmission,
  type CatalogueRequestSubmission,
  type CustomizeOrderSubmission,
  type LeadsSummary,
  type ProductOrderSubmission,
} from "@/lib/admin-leads";
import type { CatalogProductAdminRecord, CatalogServiceRecord } from "@/lib/cms/catalog-admin";
import type { MagazineArticleRecord } from "@/lib/cms/magazine";
import type { AdminUserRecord } from "@/lib/admin-users";
import { AdminNavIcon } from "./AdminNavIcon";
import { AdminWorkspaceLayout } from "./AdminWorkspaceLayout";

type DashboardOverviewProps = {
  user: AdminUser;
};

type MediaFileRecord = {
  url: string;
  key: string;
  name: string;
  uploadedAt?: string;
};

type RecentItem = {
  id: string;
  kind: "customize" | "appointment" | "catalogue" | "order";
  kindLabel: string;
  title: string;
  subtitle: string;
  status: string;
  createdAt: string;
  href: string;
};

type DashboardStats = {
  leads: LeadsSummary | null;
  services: CatalogServiceRecord[];
  products: CatalogProductAdminRecord[];
  articles: MagazineArticleRecord[];
  mediaCount: number | null;
  users: AdminUserRecord[] | null;
  recent: RecentItem[];
};

const EMPTY_STATS: DashboardStats = {
  leads: null,
  services: [],
  products: [],
  articles: [],
  mediaCount: null,
  users: null,
  recent: [],
};

function canAccessLeads(role: string) {
  return role === "admin" || role === "editor";
}

function canAccessMedia(role: string) {
  return role === "admin" || role === "editor";
}

function canAccessUsers(role: string) {
  return role === "admin";
}

function sumBucket(
  leads: LeadsSummary | null,
  key: "total" | "open" | "today",
): number {
  if (!leads) return 0;
  return (
    leads.customizeOrders[key] +
    leads.appointments[key] +
    leads.catalogueRequests[key] +
    leads.productOrders[key]
  );
}

function toRecent(
  kind: RecentItem["kind"],
  kindLabel: string,
  record:
    | CustomizeOrderSubmission
    | AppointmentSubmission
    | CatalogueRequestSubmission
    | ProductOrderSubmission,
  subtitle: string,
  href: string,
): RecentItem {
  return {
    id: `${kind}-${record.id}`,
    kind,
    kindLabel,
    title: customerName(record.firstName, record.lastName),
    subtitle,
    status: record.status,
    createdAt: record.createdAt,
    href,
  };
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const contentPageCount = useMemo(() => {
    const tabs = getAdminContentTabs();
    return tabs.reduce((count, tab) => count + 1 + (tab.children?.length ?? 0), 0);
  }, []);

  const loadDashboard = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") setLoading(true);
      else setRefreshing(true);
      setLoadError(null);

      try {
        const requests: Array<Promise<Response>> = [
          fetch("/api/admin/catalog/services", { cache: "no-store" }),
          fetch("/api/admin/catalog/products", { cache: "no-store" }),
          fetch("/api/admin/magazine/articles", { cache: "no-store" }),
        ];

        const indexes = {
          services: 0,
          products: 1,
          articles: 2,
          summary: -1,
          customize: -1,
          appointments: -1,
          catalogue: -1,
          orders: -1,
          media: -1,
          users: -1,
        };

        if (canAccessLeads(user.role)) {
          indexes.summary = requests.length;
          requests.push(fetch("/api/admin/leads/summary", { cache: "no-store" }));
          indexes.customize = requests.length;
          requests.push(fetch("/api/admin/leads/customize-orders", { cache: "no-store" }));
          indexes.appointments = requests.length;
          requests.push(fetch("/api/admin/leads/appointments", { cache: "no-store" }));
          indexes.catalogue = requests.length;
          requests.push(fetch("/api/admin/leads/catalogue-requests", { cache: "no-store" }));
          indexes.orders = requests.length;
          requests.push(fetch("/api/admin/leads/product-orders", { cache: "no-store" }));
        }

        if (canAccessMedia(user.role)) {
          indexes.media = requests.length;
          requests.push(fetch("/api/admin/media", { cache: "no-store" }));
        }

        if (canAccessUsers(user.role)) {
          indexes.users = requests.length;
          requests.push(fetch("/api/admin/users", { cache: "no-store" }));
        }

        const responses = await Promise.all(requests);

        async function readJson<T>(index: number): Promise<T | null> {
          if (index < 0) return null;
          const response = responses[index];
          if (!response) return null;
          return (await response.json().catch(() => ({}))) as T;
        }

        const servicesData = await readJson<{
          services?: CatalogServiceRecord[];
          error?: string;
        }>(indexes.services);
        const productsData = await readJson<{
          products?: CatalogProductAdminRecord[];
          error?: string;
        }>(indexes.products);
        const articlesData = await readJson<{
          articles?: MagazineArticleRecord[];
          error?: string;
        }>(indexes.articles);

        if (!responses[indexes.services]?.ok) {
          throw new Error(servicesData?.error ?? "Failed to load catalog services.");
        }
        if (!responses[indexes.products]?.ok) {
          throw new Error(productsData?.error ?? "Failed to load catalog products.");
        }
        if (!responses[indexes.articles]?.ok) {
          throw new Error(articlesData?.error ?? "Failed to load magazine articles.");
        }

        let leads: LeadsSummary | null = null;
        let recent: RecentItem[] = [];

        if (canAccessLeads(user.role)) {
          const summaryData = await readJson<{
            summary?: LeadsSummary;
            error?: string;
          }>(indexes.summary);
          const customizeData = await readJson<{
            submissions?: CustomizeOrderSubmission[];
            error?: string;
          }>(indexes.customize);
          const appointmentData = await readJson<{
            submissions?: AppointmentSubmission[];
            error?: string;
          }>(indexes.appointments);
          const catalogueData = await readJson<{
            submissions?: CatalogueRequestSubmission[];
            error?: string;
          }>(indexes.catalogue);
          const ordersData = await readJson<{
            submissions?: ProductOrderSubmission[];
            error?: string;
          }>(indexes.orders);

          if (
            !responses[indexes.summary]?.ok ||
            !responses[indexes.customize]?.ok ||
            !responses[indexes.appointments]?.ok ||
            !responses[indexes.catalogue]?.ok ||
            !responses[indexes.orders]?.ok
          ) {
            throw new Error(
              summaryData?.error ??
                customizeData?.error ??
                appointmentData?.error ??
                catalogueData?.error ??
                ordersData?.error ??
                "Failed to load leads overview.",
            );
          }

          leads = summaryData?.summary ?? null;

          recent = [
            ...(customizeData?.submissions ?? []).map((row) =>
              toRecent(
                "customize",
                "Customize order",
                row,
                row.product || row.service || "Customization request",
                "/maknisa-admin/dashboard/leads",
              ),
            ),
            ...(appointmentData?.submissions ?? []).map((row) =>
              toRecent(
                "appointment",
                "Appointment",
                row,
                row.service || "Showroom appointment",
                "/maknisa-admin/dashboard/leads",
              ),
            ),
            ...(catalogueData?.submissions ?? []).map((row) =>
              toRecent(
                "catalogue",
                "Catalogue",
                row,
                row.catalogueType || "Catalogue request",
                "/maknisa-admin/dashboard/leads",
              ),
            ),
            ...(ordersData?.submissions ?? []).map((row) =>
              toRecent(
                "order",
                "Product order",
                row,
                formatProductOrderSummary(row.items),
                "/maknisa-admin/dashboard/leads",
              ),
            ),
          ]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )
            .slice(0, 8);
        }

        let mediaCount: number | null = null;
        if (canAccessMedia(user.role)) {
          const mediaData = await readJson<{
            files?: MediaFileRecord[];
            error?: string;
          }>(indexes.media);
          if (!responses[indexes.media]?.ok) {
            throw new Error(mediaData?.error ?? "Failed to load media.");
          }
          mediaCount = mediaData?.files?.length ?? 0;
        }

        let users: AdminUserRecord[] | null = null;
        if (canAccessUsers(user.role)) {
          const usersData = await readJson<{
            users?: AdminUserRecord[];
            error?: string;
          }>(indexes.users);
          if (!responses[indexes.users]?.ok) {
            throw new Error(usersData?.error ?? "Failed to load users.");
          }
          users = usersData?.users ?? [];
        }

        setStats({
          leads,
          services: servicesData?.services ?? [],
          products: productsData?.products ?? [],
          articles: articlesData?.articles ?? [],
          mediaCount,
          users,
          recent,
        });
        setUpdatedAt(new Date());
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load dashboard overview.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user.role],
  );

  useEffect(() => {
    void loadDashboard("initial");
  }, [loadDashboard]);

  const publishedProducts = stats.products.filter((product) => product.isPublished).length;
  const draftProducts = stats.products.length - publishedProducts;
  const shopProducts = stats.products.filter((product) => product.onlineShop).length;
  const publishedServices = stats.services.filter((service) => service.isPublished).length;
  const publishedArticles = stats.articles.filter((article) => article.published).length;
  const activeUsers = stats.users?.filter((record) => record.isActive).length ?? 0;

  const openLeads = sumBucket(stats.leads, "open");
  const todayLeads = sumBucket(stats.leads, "today");
  const totalLeads = sumBucket(stats.leads, "total");

  const kpiCards = [
    canAccessLeads(user.role)
      ? {
          id: "open-leads",
          label: "Open leads",
          value: openLeads,
          hint: `${todayLeads} new today`,
          href: "/maknisa-admin/dashboard/leads",
          tone: "accent" as const,
        }
      : null,
    {
      id: "products",
      label: "Products",
      value: stats.products.length,
      hint: `${publishedProducts} published · ${draftProducts} draft`,
      href: "/maknisa-admin/dashboard/catalog",
      tone: "neutral" as const,
    },
    {
      id: "services",
      label: "Services",
      value: stats.services.length,
      hint: `${publishedServices} live on site`,
      href: "/maknisa-admin/dashboard/catalog",
      tone: "neutral" as const,
    },
    {
      id: "magazine",
      label: "Magazine",
      value: stats.articles.length,
      hint: `${publishedArticles} published`,
      href: "/maknisa-admin/dashboard/content",
      tone: "neutral" as const,
    },
    canAccessMedia(user.role)
      ? {
          id: "media",
          label: "Media files",
          value: stats.mediaCount ?? 0,
          hint: "Uploads library",
          href: "/maknisa-admin/dashboard/media",
          tone: "neutral" as const,
        }
      : null,
    canAccessUsers(user.role)
      ? {
          id: "users",
          label: "Users",
          value: stats.users?.length ?? 0,
          hint: `${activeUsers} active`,
          href: "/maknisa-admin/dashboard/users",
          tone: "neutral" as const,
        }
      : null,
  ].filter(Boolean) as Array<{
    id: string;
    label: string;
    value: number;
    hint: string;
    href: string;
    tone: "accent" | "neutral";
  }>;

  const leadInbox = stats.leads
    ? [
        {
          id: "customize-orders",
          label: "Customization",
          ...stats.leads.customizeOrders,
        },
        {
          id: "appointments",
          label: "Appointments",
          ...stats.leads.appointments,
        },
        {
          id: "catalogue-requests",
          label: "Catalogue",
          ...stats.leads.catalogueRequests,
        },
        {
          id: "product-orders",
          label: "Product orders",
          ...stats.leads.productOrders,
        },
      ]
    : [];

  const modules = [
    {
      id: "content",
      label: "Content",
      description: "Home, company pages, catalogue, inspire-me, magazine & support.",
      meta: `${contentPageCount} editable pages · ${stats.articles.length} articles`,
      href: "/maknisa-admin/dashboard/content",
      icon: "content" as const,
      visible: true,
    },
    {
      id: "catalog",
      label: "Catalog",
      description: "Services, categories, and product listings across the site.",
      meta: `${stats.services.length} services · ${shopProducts} buyable products`,
      href: "/maknisa-admin/dashboard/catalog",
      icon: "catalog" as const,
      visible: true,
    },
    {
      id: "media",
      label: "Media",
      description: "Upload and reuse images for pages, products, and magazine.",
      meta:
        stats.mediaCount === null
          ? "Available for editors"
          : `${stats.mediaCount} files in library`,
      href: "/maknisa-admin/dashboard/media",
      icon: "media" as const,
      visible: canAccessMedia(user.role),
    },
    {
      id: "leads",
      label: "Leads & Orders",
      description: "Appointments, customizations, catalogues, and product orders.",
      meta: stats.leads
        ? `${totalLeads} total · ${openLeads} open`
        : "Available for editors",
      href: "/maknisa-admin/dashboard/leads",
      icon: "leads" as const,
      visible: canAccessLeads(user.role),
    },
    {
      id: "users",
      label: "Users",
      description: "Admin accounts, roles, and access control.",
      meta:
        stats.users === null
          ? "Admin only"
          : `${stats.users.length} accounts · ${activeUsers} active`,
      href: "/maknisa-admin/dashboard/users",
      icon: "users" as const,
      visible: canAccessUsers(user.role),
    },
    {
      id: "settings",
      label: "Settings",
      description: "Workspace preferences and configuration.",
      meta: "Coming soon",
      href: "/maknisa-admin/dashboard/settings",
      icon: "settings" as const,
      visible: user.role === "admin" || user.role === "editor",
    },
  ].filter((module) => module.visible);

  const updatedLabel = updatedAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(updatedAt)
    : null;

  return (
    <AdminWorkspaceLayout
      user={user}
      title="Dashboard"
      breadcrumbs={[
        { label: "Home", href: "/maknisa-admin/dashboard" },
        { label: "Dashboard" },
      ]}
    >
      <div className="admin-home admin-dash__workspace-scroll">
        <section className="admin-home__hero">
          <div className="admin-home__hero-copy">
            <p className="admin-home__eyebrow">Maknisa overview</p>
            <h2 className="admin-home__greeting">
              Welcome back, {user.username || "Admin"}
            </h2>
            <p className="admin-home__subtitle">
              Monitor leads, catalog, content, media, and team activity from one place.
            </p>
          </div>
          <div className="admin-home__hero-actions">
            {updatedLabel ? (
              <span className="admin-home__updated">Updated {updatedLabel}</span>
            ) : null}
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--dark"
              onClick={() => void loadDashboard("refresh")}
              disabled={loading || refreshing}
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
            <Link
              href="/"
              className="admin-dash__btn admin-dash__btn--light"
              target="_blank"
              rel="noreferrer"
            >
              View website
            </Link>
          </div>
        </section>

        {loadError ? <p className="admin-cms-error">{loadError}</p> : null}

        {loading ? (
          <p className="admin-cms-loading">Loading dashboard overview…</p>
        ) : (
          <>
            <section className="admin-home__kpi-grid" aria-label="Key metrics">
              {kpiCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className={`admin-home__kpi-card admin-home__kpi-card--${card.tone}`}
                >
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  <em>{card.hint}</em>
                </Link>
              ))}
            </section>

            <div className="admin-home__split">
              {canAccessLeads(user.role) && stats.leads ? (
                <section className="admin-home__panel">
                  <div className="admin-home__panel-head">
                    <div>
                      <h3>Leads inbox</h3>
                      <p>
                        {openLeads} open · {todayLeads} today · {totalLeads} total
                      </p>
                    </div>
                    <Link
                      href="/maknisa-admin/dashboard/leads"
                      className="admin-home__panel-link"
                    >
                      Open leads
                    </Link>
                  </div>
                  <div className="admin-home__inbox-grid">
                    {leadInbox.map((inbox) => (
                      <Link
                        key={inbox.id}
                        href="/maknisa-admin/dashboard/leads"
                        className="admin-home__inbox-card"
                      >
                        <span>{inbox.label}</span>
                        <strong>{inbox.open}</strong>
                        <em>
                          {inbox.today} today · {inbox.total} total
                        </em>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="admin-home__panel">
                <div className="admin-home__panel-head">
                  <div>
                    <h3>Workspace modules</h3>
                    <p>Jump into every admin area for this site.</p>
                  </div>
                </div>
                <div className="admin-home__modules">
                  {modules.map((module) => (
                    <Link
                      key={module.id}
                      href={module.href}
                      className="admin-home__module-card"
                    >
                      <span className="admin-home__module-icon" aria-hidden>
                        <AdminNavIcon name={module.icon} />
                      </span>
                      <span className="admin-home__module-body">
                        <strong>{module.label}</strong>
                        <p>{module.description}</p>
                        <em>{module.meta}</em>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {canAccessLeads(user.role) ? (
              <section className="admin-home__panel admin-home__panel--wide">
                <div className="admin-home__panel-head">
                  <div>
                    <h3>Recent activity</h3>
                    <p>Latest customer submissions across all inboxes.</p>
                  </div>
                  <Link
                    href="/maknisa-admin/dashboard/leads"
                    className="admin-home__panel-link"
                  >
                    View all
                  </Link>
                </div>

                {stats.recent.length === 0 ? (
                  <div className="admin-home__empty">
                    No leads or orders yet. New website submissions will appear here.
                  </div>
                ) : (
                  <div className="admin-home__table-wrap">
                    <table className="admin-dash__table admin-home__table">
                      <thead>
                        <tr>
                          <th scope="col">When</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Type</th>
                          <th scope="col">Details</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent.map((item) => (
                          <tr key={item.id}>
                            <td data-label="When">{formatLeadDate(item.createdAt)}</td>
                            <td data-label="Customer">
                              <Link href={item.href} className="admin-home__row-link">
                                <strong>{item.title}</strong>
                              </Link>
                            </td>
                            <td data-label="Type">
                              <span
                                className={`admin-home__kind admin-home__kind--${item.kind}`}
                              >
                                {item.kindLabel}
                              </span>
                            </td>
                            <td data-label="Details">{item.subtitle}</td>
                            <td data-label="Status">
                              <span
                                className={`admin-leads__status admin-leads__status--${item.status}`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : null}

            <section className="admin-home__panel admin-home__panel--wide">
              <div className="admin-home__panel-head">
                <div>
                  <h3>Catalog snapshot</h3>
                  <p>Published coverage across services and products.</p>
                </div>
                <Link
                  href="/maknisa-admin/dashboard/catalog"
                  className="admin-home__panel-link"
                >
                  Manage catalog
                </Link>
              </div>
              <div className="admin-home__snapshot-grid">
                <div className="admin-home__snapshot-card">
                  <span>Published products</span>
                  <strong>{publishedProducts}</strong>
                </div>
                <div className="admin-home__snapshot-card">
                  <span>Draft products</span>
                  <strong>{draftProducts}</strong>
                </div>
                <div className="admin-home__snapshot-card">
                  <span>Online shop</span>
                  <strong>{shopProducts}</strong>
                </div>
                <div className="admin-home__snapshot-card">
                  <span>Live services</span>
                  <strong>{publishedServices}</strong>
                </div>
                <div className="admin-home__snapshot-card">
                  <span>Magazine published</span>
                  <strong>{publishedArticles}</strong>
                </div>
                <div className="admin-home__snapshot-card">
                  <span>Content pages</span>
                  <strong>{contentPageCount}</strong>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminWorkspaceLayout>
  );
}
