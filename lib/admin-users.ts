export const ADMIN_USER_ROLES = ["admin", "editor", "viewer"] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];

export type AdminUserRecord = {
  id: string;
  email: string;
  username: string;
  phone: string;
  role: AdminUserRole;
  isActive: boolean;
  createdAt: string;
};

export type AdminUserDraft = {
  email: string;
  username: string;
  phone: string;
  password: string;
  role: AdminUserRole;
  isActive: boolean;
};

export const ROLE_LABELS: Record<AdminUserRole, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<AdminUserRole, string> = {
  admin: "Full access to users, content, catalog, media, and settings.",
  editor: "Manage content, catalog, and media. Read-only settings.",
  viewer: "Read-only access to content, catalog, and media.",
};

export const ROLE_PERMISSIONS: Record<AdminUserRole, readonly string[]> = {
  admin: [
    "Users",
    "Content",
    "Catalog",
    "Media",
    "Settings",
  ],
  editor: ["Content", "Catalog", "Media", "Settings (read)"],
  viewer: ["Content (read)", "Catalog (read)", "Media (read)", "Settings (read)"],
};

export function emptyUserDraft(): AdminUserDraft {
  return {
    email: "",
    username: "",
    phone: "",
    password: "",
    role: "editor",
    isActive: true,
  };
}

export function draftFromUser(user: AdminUserRecord): AdminUserDraft {
  return {
    email: user.email,
    username: user.username,
    phone: user.phone,
    password: "",
    role: user.role,
    isActive: user.isActive,
  };
}

export function createPayloadFromDraft(draft: AdminUserDraft) {
  return {
    email: draft.email.trim(),
    username: draft.username.trim(),
    phone: draft.phone.trim(),
    password: draft.password,
    role: draft.role,
  };
}

export function updatePayloadFromDraft(draft: AdminUserDraft) {
  const payload: {
    email: string;
    username: string;
    phone: string;
    role: AdminUserRole;
    isActive: boolean;
    password?: string;
  } = {
    email: draft.email.trim(),
    username: draft.username.trim(),
    phone: draft.phone.trim(),
    role: draft.role,
    isActive: draft.isActive,
  };

  if (draft.password.trim()) {
    payload.password = draft.password;
  }

  return payload;
}
