"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUser } from "@/lib/admin-auth/user";
import {
  APPOINTMENT_STATUS_LABELS,
  CATALOGUE_STATUS_LABELS,
  CUSTOMIZE_STATUS_LABELS,
  customerName,
  formatBudgetRange,
  formatCatalogueType,
  formatLeadDate,
  formatProductOrderSummary,
  formatShowroom,
  LEAD_TABS,
  PRODUCT_ORDER_STATUS_LABELS,
  PRODUCT_ORDER_TYPE_LABELS,
  type AppointmentSubmission,
  type CatalogueRequestSubmission,
  type CustomizeOrderSubmission,
  type LeadTabId,
  type LeadsSummary,
  type ProductOrderSubmission,
} from "@/lib/admin-leads";
import { storesContent } from "@/lib/company-pages";
import {
  getCustomizeFieldsForService,
  resolveCustomizeService,
} from "@/lib/customize-order";
import { SERVICE_PAGES } from "@/lib/services";
import { AdminWorkspaceLayout } from "./AdminWorkspaceLayout";
import { LeadDetailModal } from "./LeadDetailModal";

type LeadsOverviewProps = {
  user: AdminUser;
};

type AnySubmission =
  | CustomizeOrderSubmission
  | AppointmentSubmission
  | CatalogueRequestSubmission
  | ProductOrderSubmission;

const STATUS_OPTIONS: Record<LeadTabId, Array<{ value: string; label: string }>> = {
  "customize-orders": Object.entries(CUSTOMIZE_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
  appointments: Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
  "catalogue-requests": Object.entries(CATALOGUE_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
  "product-orders": Object.entries(PRODUCT_ORDER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
};

function serviceLabel(slug: string): string {
  return (
    resolveCustomizeService(slug)?.label ??
    SERVICE_PAGES.find((page) => page.slug.toLowerCase() === slug.toLowerCase())?.label ??
    slug
  );
}

function detailRowsForCustomize(record: CustomizeOrderSubmission) {
  const fields = getCustomizeFieldsForService(record.service);
  return Object.entries(record.details)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => {
      const field = fields.find((item) => item.id === key);
      const label = field?.label ?? key;
      const optionLabel = field?.options?.find((option) => option.value === value)?.label;
      return { label, value: optionLabel ?? value };
    });
}

export function LeadsOverview({ user }: LeadsOverviewProps) {
  const [activeTab, setActiveTab] = useState<LeadTabId>("customize-orders");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<LeadsSummary | null>(null);
  const [customizeOrders, setCustomizeOrders] = useState<CustomizeOrderSubmission[]>([]);
  const [appointments, setAppointments] = useState<AppointmentSubmission[]>([]);
  const [catalogueRequests, setCatalogueRequests] = useState<CatalogueRequestSubmission[]>([]);
  const [productOrders, setProductOrders] = useState<ProductOrderSubmission[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<AnySubmission | null>(null);
  const [draftStatus, setDraftStatus] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  const showroomLabels = useMemo(
    () => Object.fromEntries(storesContent.map((store) => [store.id, store.city])),
    [],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [summaryRes, customizeRes, appointmentRes, catalogueRes, productOrdersRes] =
        await Promise.all([
        fetch("/api/admin/leads/summary", { cache: "no-store" }),
        fetch("/api/admin/leads/customize-orders", { cache: "no-store" }),
        fetch("/api/admin/leads/appointments", { cache: "no-store" }),
        fetch("/api/admin/leads/catalogue-requests", { cache: "no-store" }),
        fetch("/api/admin/leads/product-orders", { cache: "no-store" }),
      ]);

      const summaryData = (await summaryRes.json().catch(() => ({}))) as {
        summary?: LeadsSummary;
        error?: string;
      };
      const customizeData = (await customizeRes.json().catch(() => ({}))) as {
        submissions?: CustomizeOrderSubmission[];
        error?: string;
      };
      const appointmentData = (await appointmentRes.json().catch(() => ({}))) as {
        submissions?: AppointmentSubmission[];
        error?: string;
      };
      const catalogueData = (await catalogueRes.json().catch(() => ({}))) as {
        submissions?: CatalogueRequestSubmission[];
        error?: string;
      };
      const productOrdersData = (await productOrdersRes.json().catch(() => ({}))) as {
        submissions?: ProductOrderSubmission[];
        error?: string;
      };

      if (
        !summaryRes.ok ||
        !customizeRes.ok ||
        !appointmentRes.ok ||
        !catalogueRes.ok ||
        !productOrdersRes.ok
      ) {
        throw new Error(
          summaryData.error ??
            customizeData.error ??
            appointmentData.error ??
            catalogueData.error ??
            productOrdersData.error ??
            "Failed to load leads.",
        );
      }

      setSummary(summaryData.summary ?? null);
      setCustomizeOrders(customizeData.submissions ?? []);
      setAppointments(appointmentData.submissions ?? []);
      setCatalogueRequests(catalogueData.submissions ?? []);
      setProductOrders(productOrdersData.submissions ?? []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const activeRecords = useMemo(() => {
    if (activeTab === "customize-orders") return customizeOrders;
    if (activeTab === "appointments") return appointments;
    if (activeTab === "product-orders") return productOrders;
    return catalogueRequests;
  }, [activeTab, customizeOrders, appointments, catalogueRequests, productOrders]);

  const filteredRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return activeRecords.filter((record) => {
      if (statusFilter !== "all" && record.status !== statusFilter) return false;
      if (!needle) return true;
      const blob = JSON.stringify(record).toLowerCase();
      return blob.includes(needle);
    });
  }, [activeRecords, query, statusFilter]);

  function openRecord(record: AnySubmission) {
    setSelected(record);
    setDraftStatus(record.status);
    setDraftNotes(record.adminNotes);
  }

  async function saveRecord() {
    if (!selected) return;
    setSaving(true);
    setLoadError(null);
    try {
      const response = await fetch(`/api/admin/leads/${activeTab}/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: draftStatus, adminNotes: draftNotes }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        submission?: AnySubmission;
        error?: string;
      };
      if (!response.ok || !data.submission) {
        throw new Error(data.error ?? "Unable to save changes.");
      }

      const updated = data.submission;
      if (activeTab === "customize-orders") {
        setCustomizeOrders((rows) =>
          rows.map((row) => (row.id === updated.id ? (updated as CustomizeOrderSubmission) : row)),
        );
      } else if (activeTab === "appointments") {
        setAppointments((rows) =>
          rows.map((row) => (row.id === updated.id ? (updated as AppointmentSubmission) : row)),
        );
      } else if (activeTab === "product-orders") {
        setProductOrders((rows) =>
          rows.map((row) => (row.id === updated.id ? (updated as ProductOrderSubmission) : row)),
        );
      } else {
        setCatalogueRequests((rows) =>
          rows.map((row) => (row.id === updated.id ? (updated as CatalogueRequestSubmission) : row)),
        );
      }

      setSelected(null);
      setStatusMessage("Lead updated.");
      const summaryRes = await fetch("/api/admin/leads/summary", { cache: "no-store" });
      const summaryData = (await summaryRes.json().catch(() => ({}))) as {
        summary?: LeadsSummary;
      };
      if (summaryRes.ok && summaryData.summary) setSummary(summaryData.summary);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function statusLabel(record: AnySubmission) {
    if (activeTab === "customize-orders") {
      return CUSTOMIZE_STATUS_LABELS[record.status as CustomizeOrderSubmission["status"]];
    }
    if (activeTab === "appointments") {
      return APPOINTMENT_STATUS_LABELS[record.status as AppointmentSubmission["status"]];
    }
    if (activeTab === "product-orders") {
      return PRODUCT_ORDER_STATUS_LABELS[record.status as ProductOrderSubmission["status"]];
    }
    return CATALOGUE_STATUS_LABELS[record.status as CatalogueRequestSubmission["status"]];
  }

  function renderTableRow(record: AnySubmission) {
    const name = customerName(record.firstName, record.lastName);

    if (activeTab === "customize-orders") {
      const row = record as CustomizeOrderSubmission;
      return (
        <tr key={row.id}>
          <td>{formatLeadDate(row.createdAt)}</td>
          <td>
            <div className="admin-users__identity">
              <strong>{name}</strong>
              <span>{row.email}</span>
            </div>
          </td>
          <td>{serviceLabel(row.service)}</td>
          <td>{formatShowroom(row.showroom, showroomLabels)}</td>
          <td>{formatBudgetRange(row.budgetRange)}</td>
          <td>
            <span className={`admin-leads__status admin-leads__status--${row.status}`}>
              {statusLabel(row)}
            </span>
          </td>
          <td>
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--light"
              onClick={() => openRecord(row)}
            >
              View
            </button>
          </td>
        </tr>
      );
    }

    if (activeTab === "appointments") {
      const row = record as AppointmentSubmission;
      return (
        <tr key={row.id}>
          <td>{formatLeadDate(row.createdAt)}</td>
          <td>
            <div className="admin-users__identity">
              <strong>{name}</strong>
              <span>{row.email}</span>
            </div>
          </td>
          <td>{serviceLabel(row.service)}</td>
          <td>{formatShowroom(row.showroom, showroomLabels)}</td>
          <td>{row.preferredDate || "—"}</td>
          <td>
            <span className={`admin-leads__status admin-leads__status--${row.status}`}>
              {statusLabel(row)}
            </span>
          </td>
          <td>
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--light"
              onClick={() => openRecord(row)}
            >
              View
            </button>
          </td>
        </tr>
      );
    }

    if (activeTab === "catalogue-requests") {
      const row = record as CatalogueRequestSubmission;
      return (
        <tr key={row.id}>
          <td>{formatLeadDate(row.createdAt)}</td>
          <td>
            <div className="admin-users__identity">
              <strong>{name}</strong>
              <span>{row.email}</span>
            </div>
          </td>
          <td>{formatCatalogueType(row.catalogueType)}</td>
          <td>{formatShowroom(row.showroom, showroomLabels)}</td>
          <td>{row.phone}</td>
          <td>
            <span className={`admin-leads__status admin-leads__status--${row.status}`}>
              {statusLabel(row)}
            </span>
          </td>
          <td>
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--light"
              onClick={() => openRecord(row)}
            >
              View
            </button>
          </td>
        </tr>
      );
    }

    const row = record as ProductOrderSubmission;
    return (
      <tr key={row.id}>
        <td>{formatLeadDate(row.createdAt)}</td>
        <td>
          <div className="admin-users__identity">
            <strong>{name}</strong>
            <span>{row.email}</span>
          </div>
        </td>
        <td>{PRODUCT_ORDER_TYPE_LABELS[row.orderType]}</td>
        <td>{formatProductOrderSummary(row.items)}</td>
        <td>{formatShowroom(row.showroom, showroomLabels)}</td>
        <td>
          <span className={`admin-leads__status admin-leads__status--${row.status}`}>
            {statusLabel(row)}
          </span>
        </td>
        <td>
          <button
            type="button"
            className="admin-dash__btn admin-dash__btn--light"
            onClick={() => openRecord(row)}
          >
            View
          </button>
        </td>
      </tr>
    );
  }

  function modalProps() {
    if (!selected) return null;

    if (activeTab === "customize-orders") {
      const row = selected as CustomizeOrderSubmission;
      return {
        title: customerName(row.firstName, row.lastName),
        subtitle: row.email,
        rows: [
          { label: "Submitted", value: formatLeadDate(row.createdAt) },
          { label: "Phone", value: row.phone },
          { label: "Service", value: serviceLabel(row.service) },
          { label: "Showroom", value: formatShowroom(row.showroom, showroomLabels) },
          { label: "Budget", value: formatBudgetRange(row.budgetRange) },
          { label: "Category", value: row.category },
          { label: "Product reference", value: row.product },
          { label: "Source page", value: row.sourcePath },
          { label: "Message", value: row.message },
        ],
        extraRows: detailRowsForCustomize(row),
      };
    }

    if (activeTab === "appointments") {
      const row = selected as AppointmentSubmission;
      return {
        title: customerName(row.firstName, row.lastName),
        subtitle: row.email,
        rows: [
          { label: "Submitted", value: formatLeadDate(row.createdAt) },
          { label: "Phone", value: row.phone },
          { label: "Service", value: serviceLabel(row.service) },
          { label: "Showroom", value: formatShowroom(row.showroom, showroomLabels) },
          { label: "Preferred date", value: row.preferredDate },
          { label: "Source page", value: row.sourcePath },
          { label: "Message", value: row.message },
        ],
        extraRows: [],
      };
    }

    if (activeTab === "catalogue-requests") {
      const row = selected as CatalogueRequestSubmission;
      return {
        title: customerName(row.firstName, row.lastName),
        subtitle: row.email,
        rows: [
          { label: "Submitted", value: formatLeadDate(row.createdAt) },
          { label: "Phone", value: row.phone },
          { label: "Catalogue type", value: formatCatalogueType(row.catalogueType) },
          { label: "Showroom", value: formatShowroom(row.showroom, showroomLabels) },
          { label: "Delivery address", value: row.deliveryAddress },
          { label: "Source page", value: row.sourcePath },
          { label: "Message", value: row.message },
        ],
        extraRows: [],
      };
    }

    const row = selected as ProductOrderSubmission;
    return {
      title: customerName(row.firstName, row.lastName),
      subtitle: row.email,
      rows: [
        { label: "Submitted", value: formatLeadDate(row.createdAt) },
        { label: "Phone", value: row.phone },
        { label: "Order type", value: PRODUCT_ORDER_TYPE_LABELS[row.orderType] },
        { label: "Showroom", value: formatShowroom(row.showroom, showroomLabels) },
        { label: "Source page", value: row.sourcePath },
        { label: "Message", value: row.message },
      ],
      extraRows: row.items.flatMap((item, index) => [
        { label: `Product ${index + 1}`, value: item.productTitle },
        { label: `Service ${index + 1}`, value: serviceLabel(item.serviceSlug) },
        { label: `Quantity ${index + 1}`, value: String(item.quantity) },
        ...(item.color ? [{ label: `Color ${index + 1}`, value: item.color }] : []),
        ...(item.size ? [{ label: `Size ${index + 1}`, value: item.size }] : []),
        ...(item.pieces ? [{ label: `Pieces ${index + 1}`, value: item.pieces }] : []),
      ]),
    };
  }

  const modal = modalProps();
  const tabSummary =
    activeTab === "customize-orders"
      ? summary?.customizeOrders
      : activeTab === "appointments"
        ? summary?.appointments
        : activeTab === "product-orders"
          ? summary?.productOrders
          : summary?.catalogueRequests;

  return (
    <AdminWorkspaceLayout
      user={user}
      title="Leads & Orders"
      breadcrumbs={[
        { label: "Home", href: "/maknisa-admin/dashboard" },
        { label: "Leads & Orders" },
      ]}
    >
      <div className="admin-catalog__layout">
        <aside className="admin-catalog__services-sidebar" aria-label="Lead types">
          <h2 className="admin-catalog__services-title">Inbox</h2>
          <ul className="admin-catalog__services-list">
            {LEAD_TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  className={`admin-catalog__service-btn${
                    activeTab === tab.id ? " is-active" : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setStatusFilter("all");
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="admin-catalog__builder-wrap">
          <div className="admin-leads">
            {summary ? (
              <div className="admin-leads__summary">
                <article className="admin-leads__summary-card">
                  <span>Today</span>
                  <strong>{tabSummary?.today ?? 0}</strong>
                </article>
                <article className="admin-leads__summary-card">
                  <span>Open</span>
                  <strong>{tabSummary?.open ?? 0}</strong>
                </article>
                <article className="admin-leads__summary-card">
                  <span>Total</span>
                  <strong>{tabSummary?.total ?? 0}</strong>
                </article>
              </div>
            ) : null}

            <div className="admin-leads__toolbar">
              <label className="admin-dash__search admin-leads__search">
                <span className="sr-only">Search leads</span>
                <input
                  type="search"
                  placeholder="Search name, email, phone, service…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <select
                className="admin-leads__filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS[activeTab].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {statusMessage ? <p className="admin-cms-status">{statusMessage}</p> : null}
            {loadError ? <p className="admin-cms-error">{loadError}</p> : null}

            {loading ? (
              <div className="admin-cms-loading">Loading leads…</div>
            ) : filteredRecords.length === 0 ? (
              <div className="admin-leads__empty">
                <p>No submissions yet for this inbox.</p>
              </div>
            ) : (
              <div className="admin-dash__table-wrap admin-users__table-wrap">
                <table className="admin-dash__table admin-users__table">
                  <thead>
                    <tr>
                      <th scope="col">Submitted</th>
                      <th scope="col">Customer</th>
                      {activeTab === "customize-orders" ? (
                        <>
                          <th scope="col">Service</th>
                          <th scope="col">Showroom</th>
                          <th scope="col">Budget</th>
                        </>
                      ) : null}
                      {activeTab === "appointments" ? (
                        <>
                          <th scope="col">Service</th>
                          <th scope="col">Showroom</th>
                          <th scope="col">Preferred date</th>
                        </>
                      ) : null}
                      {activeTab === "catalogue-requests" ? (
                        <>
                          <th scope="col">Catalogue</th>
                          <th scope="col">Showroom</th>
                          <th scope="col">Phone</th>
                        </>
                      ) : null}
                      {activeTab === "product-orders" ? (
                        <>
                          <th scope="col">Type</th>
                          <th scope="col">Products</th>
                          <th scope="col">Showroom</th>
                        </>
                      ) : null}
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{filteredRecords.map((record) => renderTableRow(record))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && selected ? (
        <LeadDetailModal
          open
          tab={activeTab}
          title={modal.title}
          subtitle={modal.subtitle}
          rows={modal.rows}
          extraRows={modal.extraRows}
          status={draftStatus}
          statusOptions={STATUS_OPTIONS[activeTab]}
          adminNotes={draftNotes}
          saving={saving}
          onClose={() => setSelected(null)}
          onStatusChange={setDraftStatus}
          onNotesChange={setDraftNotes}
          onSave={saveRecord}
        />
      ) : null}
    </AdminWorkspaceLayout>
  );
}
