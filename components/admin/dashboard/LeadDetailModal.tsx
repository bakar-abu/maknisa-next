"use client";

import type { LeadTabId } from "@/lib/admin-leads";

type DetailRow = {
  label: string;
  value: string;
};

type LeadDetailModalProps = {
  open: boolean;
  tab: LeadTabId;
  title: string;
  subtitle?: string;
  rows: DetailRow[];
  extraRows?: DetailRow[];
  status: string;
  statusOptions: Array<{ value: string; label: string }>;
  adminNotes: string;
  saving?: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  onSave: () => Promise<void>;
};

export function LeadDetailModal({
  open,
  tab,
  title,
  subtitle,
  rows,
  extraRows = [],
  status,
  statusOptions,
  adminNotes,
  saving = false,
  onClose,
  onStatusChange,
  onNotesChange,
  onSave,
}: LeadDetailModalProps) {
  if (!open) return null;

  const tabLabel =
    tab === "customize-orders"
      ? "Customization order"
      : tab === "appointments"
        ? "Appointment"
        : tab === "product-orders"
          ? "Product order"
          : "Catalogue request";

  return (
    <div className="admin-cms-modal" role="presentation">
      <button
        type="button"
        className="admin-cms-dialog__backdrop"
        aria-label="Close lead details"
        onClick={onClose}
      />
      <div className="admin-cms-modal__panel admin-leads-modal" role="dialog" aria-modal="true">
        <header className="admin-cms-modal__header">
          <div>
            <p className="admin-cms-modal__eyebrow">{tabLabel}</p>
            <h3>{title}</h3>
            {subtitle ? <p className="admin-leads-modal__subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="admin-cms-modal__close" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="admin-cms-modal__body admin-leads-modal__body">
          <dl className="admin-leads-detail-list">
            {rows.map((row) => (
              <div key={row.label} className="admin-leads-detail-list__row">
                <dt>{row.label}</dt>
                <dd>{row.value || "—"}</dd>
              </div>
            ))}
          </dl>

          {extraRows.length > 0 ? (
            <>
              <h4 className="admin-leads-modal__section-title">Project details</h4>
              <dl className="admin-leads-detail-list">
                {extraRows.map((row) => (
                  <div key={row.label} className="admin-leads-detail-list__row">
                    <dt>{row.label}</dt>
                    <dd>{row.value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}

          <div className="admin-leads-modal__controls">
            <label className="admin-cms-field">
              <span>Status</span>
              <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Internal notes</span>
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(event) => onNotesChange(event.target.value)}
                placeholder="Notes visible only to admin users…"
              />
            </label>
          </div>
        </div>

        <footer className="admin-cms-modal__footer">
          <button type="button" className="admin-dash__btn admin-dash__btn--light" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-dash__btn admin-dash__btn--dark"
            disabled={saving}
            onClick={() => void onSave()}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </footer>
      </div>
    </div>
  );
}
