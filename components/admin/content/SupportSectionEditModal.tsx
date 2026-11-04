"use client";

import { useEffect, useState } from "react";
import type { SupportSlug } from "@/lib/cms/support-page";
import { asSupportSectionContent } from "@/lib/cms/support-page";
import {
  AfterSalesIntroEditor,
  AfterSalesRegisterBannerEditor,
  AfterSalesWarrantyNavEditor,
  AppointmentAsideEditor,
  AppointmentIntroEditor,
  CustomizeIntroEditor,
  FormMessagesEditor,
  WarrantyBlockEditor,
} from "./editors/SupportPageEditors";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

const WIDE_MODAL_SECTIONS = new Set([
  "warranty-kitchen-living",
  "warranty-bathrooms",
]);

type SupportSectionEditModalProps = {
  open: boolean;
  supportSlug: SupportSlug;
  sectionId: string;
  sectionLabel: string;
  pageLabel: string;
  content: unknown;
  saving?: boolean;
  onClose: () => void;
  onSave: (content: unknown) => Promise<void>;
};

export function SupportSectionEditModal({
  open,
  supportSlug,
  sectionId,
  sectionLabel,
  pageLabel,
  content,
  saving = false,
  onClose,
  onSave,
}: SupportSectionEditModalProps) {
  const [draft, setDraft] = useState<unknown>(() =>
    asSupportSectionContent(supportSlug, sectionId, content),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(asSupportSectionContent(supportSlug, sectionId, content));
    }
  }, [open, supportSlug, sectionId, content]);

  if (!open) return null;

  const isWideModal = WIDE_MODAL_SECTIONS.has(sectionId);

  async function handleConfirmSave() {
    await onSave(draft);
    setConfirmOpen(false);
    onClose();
  }

  function renderEditor() {
    if (supportSlug === "after-sales-services") {
      if (sectionId === "intro") {
        return (
          <AfterSalesIntroEditor
            content={draft as Parameters<typeof AfterSalesIntroEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
      if (sectionId === "register-banner") {
        return (
          <AfterSalesRegisterBannerEditor
            content={draft as Parameters<typeof AfterSalesRegisterBannerEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
      if (sectionId === "warranty-nav") {
        return (
          <AfterSalesWarrantyNavEditor
            content={draft as Parameters<typeof AfterSalesWarrantyNavEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
      if (sectionId === "warranty-kitchen-living" || sectionId === "warranty-bathrooms") {
        return (
          <WarrantyBlockEditor
            content={draft as Parameters<typeof WarrantyBlockEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
    }

    if (supportSlug === "book-an-appointment") {
      if (sectionId === "intro") {
        return (
          <AppointmentIntroEditor
            content={draft as Parameters<typeof AppointmentIntroEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
      if (sectionId === "aside") {
        return (
          <AppointmentAsideEditor
            content={draft as Parameters<typeof AppointmentAsideEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
      if (sectionId === "form-messages") {
        return (
          <FormMessagesEditor
            content={draft as Parameters<typeof FormMessagesEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
    }

    if (supportSlug === "customize-your-order") {
      if (sectionId === "intro") {
        return (
          <CustomizeIntroEditor
            content={draft as Parameters<typeof CustomizeIntroEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
      if (sectionId === "form-messages") {
        return (
          <FormMessagesEditor
            content={draft as Parameters<typeof FormMessagesEditor>[0]["content"]}
            onChange={setDraft}
          />
        );
      }
    }

    return (
      <div className="admin-cms-editor__placeholder">
        <p>
          No editor is available for <strong>{sectionLabel}</strong> yet.
        </p>
      </div>
    );
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
        message={`This will update ${sectionLabel} on ${pageLabel}.`}
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmSave()}
      />
    </>
  );
}
