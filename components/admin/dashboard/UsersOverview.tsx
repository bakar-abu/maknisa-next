"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUser } from "@/lib/admin-auth/user";
import {
  createPayloadFromDraft,
  ROLE_LABELS,
  updatePayloadFromDraft,
  type AdminUserDraft,
  type AdminUserRecord,
} from "@/lib/admin-users";
import { AdminWorkspaceLayout } from "./AdminWorkspaceLayout";
import { UserFormModal } from "./UserFormModal";

type UsersOverviewProps = {
  user: AdminUser;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function UsersOverview({ user }: UsersOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        users?: AdminUserRecord[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load users.");
      }

      setUsers(data.users ?? []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function openCreateModal() {
    setModalMode("create");
    setEditingUser(null);
    setModalOpen(true);
  }

  function openEditModal(record: AdminUserRecord) {
    setModalMode("edit");
    setEditingUser(record);
    setModalOpen(true);
  }

  async function saveUser(draft: AdminUserDraft) {
    if (modalMode === "create" && !draft.password.trim()) {
      setLoadError("Password is required for new users.");
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    setLoadError(null);

    try {
      const response = await fetch(
        modalMode === "create"
          ? "/api/admin/users"
          : `/api/admin/users/${editingUser?.id}`,
        {
          method: modalMode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            modalMode === "create"
              ? createPayloadFromDraft(draft)
              : updatePayloadFromDraft(draft),
          ),
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        user?: AdminUserRecord;
        error?: string;
      };

      if (!response.ok || !data.user) {
        throw new Error(data.error ?? "Unable to save user.");
      }

      setUsers((current) => {
        if (modalMode === "create") {
          return [data.user!, ...current];
        }
        return current.map((item) => (item.id === data.user!.id ? data.user! : item));
      });
      setStatusMessage(modalMode === "create" ? "User created." : "User updated.");
      setModalOpen(false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to save user.");
    } finally {
      setSaving(false);
    }
  }

  const filteredUsers = users.filter((record) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      record.email.toLowerCase().includes(needle) ||
      record.username.toLowerCase().includes(needle) ||
      record.phone.toLowerCase().includes(needle) ||
      record.role.toLowerCase().includes(needle)
    );
  });

  return (
    <AdminWorkspaceLayout
      user={user}
      title="Users"
      breadcrumbs={[
        { label: "Home", href: "/maknisa-admin/dashboard" },
        { label: "Users" },
      ]}
    >
      <div className="admin-dash__workspace-scroll">
        <div className="admin-users">
          <div className="admin-users__toolbar">
            <label className="admin-dash__search admin-users__search">
              <span className="sr-only">Search users</span>
              <input
                type="search"
                placeholder="Search by name, email, phone, or role…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--dark"
              onClick={openCreateModal}
            >
              Create user
            </button>
          </div>

          {statusMessage ? <p className="admin-cms-status">{statusMessage}</p> : null}
          {loadError ? <p className="admin-cms-error">{loadError}</p> : null}

          {loading ? (
            <div className="admin-cms-loading">Loading users…</div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-users__empty">
              <p>{query ? "No users match your search." : "No users found."}</p>
              {!query ? (
                <button
                  type="button"
                  className="admin-dash__btn admin-dash__btn--light"
                  onClick={openCreateModal}
                >
                  Create your first user
                </button>
              ) : null}
            </div>
          ) : (
            <div className="admin-dash__table-wrap admin-users__table-wrap">
              <table className="admin-dash__table admin-users__table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created</th>
                    <th scope="col" className="admin-dash__th-actions">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div className="admin-users__identity">
                          <strong>{record.username}</strong>
                          <span>{record.email}</span>
                        </div>
                      </td>
                      <td>{record.phone}</td>
                      <td>
                        <span className={`admin-users__role-pill admin-users__role-pill--${record.role}`}>
                          {ROLE_LABELS[record.role]}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-users__status-pill${
                            record.isActive ? "" : " is-inactive"
                          }`}
                        >
                          {record.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{formatDate(record.createdAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-dash__btn admin-dash__btn--light"
                          onClick={() => openEditModal(record)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <UserFormModal
        open={modalOpen}
        mode={modalMode}
        user={editingUser}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={saveUser}
      />
    </AdminWorkspaceLayout>
  );
}
