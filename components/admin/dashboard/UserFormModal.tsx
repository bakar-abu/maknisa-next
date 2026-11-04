"use client";

import { useEffect, useState } from "react";
import {
  ADMIN_USER_ROLES,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  type AdminUserDraft,
  type AdminUserRecord,
} from "@/lib/admin-users";

type UserFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  user: AdminUserRecord | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (draft: AdminUserDraft) => Promise<void>;
};

export function UserFormModal({
  open,
  mode,
  user,
  saving = false,
  onClose,
  onSave,
}: UserFormModalProps) {
  const [draft, setDraft] = useState<AdminUserDraft>({
    email: "",
    username: "",
    phone: "",
    password: "",
    role: "editor",
    isActive: true,
  });

  useEffect(() => {
    if (!open) return;
    setDraft(
      user
        ? {
            email: user.email,
            username: user.username,
            phone: user.phone,
            password: "",
            role: user.role,
            isActive: user.isActive,
          }
        : {
            email: "",
            username: "",
            phone: "",
            password: "",
            role: "editor",
            isActive: true,
          },
    );
  }, [open, user]);

  if (!open) return null;

  function updateDraft<K extends keyof AdminUserDraft>(key: K, value: AdminUserDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="admin-cms-modal" role="presentation">
      <button
        type="button"
        className="admin-cms-dialog__backdrop"
        aria-label="Close user form"
        onClick={onClose}
      />
      <div className="admin-cms-modal__panel admin-users-modal" role="dialog" aria-modal="true">
        <header className="admin-cms-modal__header">
          <div>
            <p className="admin-cms-modal__eyebrow">
              {mode === "create" ? "New user" : "Edit user"}
            </p>
            <h3>{draft.username || draft.email || "Admin user"}</h3>
          </div>
          <button type="button" className="admin-cms-modal__close" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="admin-cms-modal__body admin-users-modal__body">
          <div className="admin-users-modal__grid">
            <label className="admin-cms-field">
              <span>Email</span>
              <input
                type="email"
                value={draft.email}
                onChange={(event) => updateDraft("email", event.target.value)}
                placeholder="user@maknisa.com"
              />
            </label>
            <label className="admin-cms-field">
              <span>Username</span>
              <input
                type="text"
                value={draft.username}
                onChange={(event) => updateDraft("username", event.target.value)}
                placeholder="Display name"
              />
            </label>
            <label className="admin-cms-field">
              <span>Phone</span>
              <input
                type="text"
                value={draft.phone}
                onChange={(event) => updateDraft("phone", event.target.value)}
                placeholder="03XXXXXXXXX"
              />
            </label>
            <label className="admin-cms-field">
              <span>{mode === "create" ? "Password" : "New password (optional)"}</span>
              <input
                type="password"
                value={draft.password}
                onChange={(event) => updateDraft("password", event.target.value)}
                placeholder={mode === "create" ? "Minimum 8 characters" : "Leave blank to keep current"}
              />
            </label>
          </div>

          <div className="admin-users-modal__role-section">
            <p className="admin-users-modal__label">Role & access</p>
            <div className="admin-users-modal__roles">
              {ADMIN_USER_ROLES.map((role) => (
                <label
                  key={role}
                  className={`admin-users-role-card${draft.role === role ? " is-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="user-role"
                    value={role}
                    checked={draft.role === role}
                    onChange={() => updateDraft("role", role)}
                  />
                  <span className="admin-users-role-card__title">{ROLE_LABELS[role]}</span>
                  <span className="admin-users-role-card__description">
                    {ROLE_DESCRIPTIONS[role]}
                  </span>
                  <span className="admin-users-role-card__permissions">
                    {ROLE_PERMISSIONS[role].join(" · ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {mode === "edit" ? (
            <label className="admin-users-modal__active-toggle">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(event) => updateDraft("isActive", event.target.checked)}
              />
              <span>Account is active</span>
            </label>
          ) : null}
        </div>

        <footer className="admin-cms-modal__footer">
          <button type="button" className="admin-dash__btn admin-dash__btn--light" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-dash__btn admin-dash__btn--dark"
            disabled={saving}
            onClick={() => void onSave(draft)}
          >
            {saving ? "Saving…" : mode === "create" ? "Create user" : "Save changes"}
          </button>
        </footer>
      </div>
    </div>
  );
}
