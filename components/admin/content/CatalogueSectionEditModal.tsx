"use client";

import { useEffect, useState } from "react";
import { asCatalogueSectionContent } from "@/lib/cms/catalogue-page";
import {
  CatalogueAppointmentCtaEditor,
  CatalogueIntroEditor,
  CatalogueRelatedSectionEditor,
  CatalogueServiceCardsEditor,
} from "./editors/CataloguePageEditors";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

const WIDE_MODAL_SECTIONS = new Set(["service-cards"]);

type CatalogueSectionEditModalProps = {
  open: boolean;
  sectionId: string;
  sectionLabel: string;
  content: unknown;
  saving?: boolean;
  onClose: () => void;
  onSave: (content: unknown) => Promise<void>;
};

export function CatalogueSectionEditModal({
  open,
  sectionId,
  sectionLabel,
  content,
  saving = false,
  onClose,
  onSave,
}: CatalogueSectionEditModalProps) {
  const [draft, setDraft] = useState<unknown>(() =>
    asCatalogueSectionContent(sectionId, content),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(asCatalogueSectionContent(sectionId, content));
    }
  }, [open, sectionId, content]);

  if (!open) return null;

  const isWideModal = WIDE_MODAL_SECTIONS.has(sectionId);

  async function handleConfirmSave() {
    await onSave(draft);
    setConfirmOpen(false);
    onClose();
  }

  function renderEditor() {
    switch (sectionId) {
      case "page-intro":
        return (
          <CatalogueIntroEditor
            content={draft as Parameters<typeof CatalogueIntroEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      case "service-cards":
        return (
          <CatalogueServiceCardsEditor
            content={draft as Parameters<typeof CatalogueServiceCardsEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      case "appointment-cta":
        return (
          <CatalogueAppointmentCtaEditor
            content={draft as Parameters<typeof CatalogueAppointmentCtaEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      case "related-section":
        return (
          <CatalogueRelatedSectionEditor
            content={draft as Parameters<typeof CatalogueRelatedSectionEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      default:
        return null;
    }
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
          className={`admin-cms-modal__panel${isWideModal ? " admin-cms-modal__panel--wide" : ""}`}
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

          <div className="admin-cms-modal__body">{renderEditor()}</div>

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
        message={`This will update ${sectionLabel} on the Catalogue page.`}
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmSave()}
      />
    </>
  );
}
