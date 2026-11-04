"use client";

import { useEffect, useState } from "react";
import type { CompanySlug } from "@/lib/company-pages";
import { asCompanyMainContent } from "@/lib/cms/company-page";
import { CompanyPageEditor } from "./editors/CompanyPageEditors";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

type CompanySectionEditModalProps = {
  open: boolean;
  companySlug: CompanySlug;
  sectionLabel: string;
  pageLabel: string;
  content: unknown;
  saving?: boolean;
  onClose: () => void;
  onSave: (content: unknown) => Promise<void>;
};

export function CompanySectionEditModal({
  open,
  companySlug,
  sectionLabel,
  pageLabel,
  content,
  saving = false,
  onClose,
  onSave,
}: CompanySectionEditModalProps) {
  const [draft, setDraft] = useState<unknown>(() =>
    asCompanyMainContent(companySlug, content),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(asCompanyMainContent(companySlug, content));
    }
  }, [open, companySlug, content]);

  if (!open) return null;

  async function handleConfirmSave() {
    await onSave(draft);
    setConfirmOpen(false);
    onClose();
  }

  return (
    <>
      <div className="admin-cms-modal" role="presentation">
        <button
          type="button"
          className="admin-cms-dialog__backdrop"
          aria-label="Close editor"
          onClick={onClose}
        />
        <div
          className="admin-cms-modal__panel admin-cms-modal__panel--wide"
          role="dialog"
          aria-modal="true"
        >
          <header className="admin-cms-modal__header">
            <div>
              <p className="admin-cms-modal__eyebrow">Edit section</p>
              <h3>{sectionLabel}</h3>
            </div>
            <button
              type="button"
              className="admin-dash__icon-btn admin-cms-modal__close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </header>

          <div className="admin-cms-modal__body">
            <CompanyPageEditor
              companySlug={companySlug}
              content={draft}
              onChange={setDraft}
            />
          </div>

          <footer className="admin-cms-modal__footer">
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--light"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--dark"
              onClick={() => setConfirmOpen(true)}
              disabled={saving}
            >
              Save section
            </button>
          </footer>
        </div>
      </div>

      <ConfirmSaveDialog
        open={confirmOpen}
        title="Save section changes?"
        message={`This will update ${pageLabel} on the live Maknisa website.`}
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmSave()}
      />
    </>
  );
}
