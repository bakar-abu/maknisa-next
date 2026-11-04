"use client";

type ConfirmSaveDialogProps = {
  open: boolean;
  title: string;
  message: string;
  saving?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmSaveDialog({
  open,
  title,
  message,
  saving = false,
  onCancel,
  onConfirm,
}: ConfirmSaveDialogProps) {
  if (!open) return null;

  return (
    <div className="admin-cms-dialog" role="presentation">
      <button
        type="button"
        className="admin-cms-dialog__backdrop"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        className="admin-cms-dialog__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-save-title"
      >
        <h3 id="confirm-save-title">{title}</h3>
        <p>{message}</p>
        <div className="admin-cms-dialog__actions">
          <button
            type="button"
            className="admin-dash__btn admin-dash__btn--light"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-dash__btn admin-dash__btn--dark"
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
