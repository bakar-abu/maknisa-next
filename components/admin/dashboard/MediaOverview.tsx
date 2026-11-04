"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminUser } from "@/lib/admin-auth/user";
import { uploadAdminImage } from "@/components/admin/content/upload-image";
import { AdminWorkspaceLayout } from "./AdminWorkspaceLayout";

export type MediaFileRecord = {
  url: string;
  key: string;
  name: string;
  uploadedAt?: string;
};

type MediaOverviewProps = {
  user: AdminUser;
};

export function MediaOverview({ user }: MediaOverviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<MediaFileRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        files?: MediaFileRecord[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load media files.");
      }

      setFiles(data.files ?? []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load media.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  async function handleUpload(file: File) {
    setUploading(true);
    setStatusMessage(null);
    setLoadError(null);
    try {
      const url = await uploadAdminImage(file);
      const name = file.name || url.split("/").pop() || "upload";
      setFiles((current) => [
        { url, key: name, name, uploadedAt: new Date().toISOString() },
        ...current,
      ]);
      setStatusMessage("Image uploaded.");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setStatusMessage("URL copied to clipboard.");
    } catch {
      setStatusMessage("Could not copy URL.");
    }
  }

  const filteredFiles = files.filter((file) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return file.name.toLowerCase().includes(needle) || file.url.toLowerCase().includes(needle);
  });

  return (
    <AdminWorkspaceLayout
      user={user}
      title="Media"
      breadcrumbs={[
        { label: "Home", href: "/maknisa-admin/dashboard" },
        { label: "Media" },
      ]}
    >
      <div className="admin-dash__workspace-scroll">
        <div className="admin-media">
        <div className="admin-media__toolbar">
          <label className="admin-dash__search admin-media__search">
            <span className="sr-only">Search media</span>
            <input
              type="search"
              placeholder="Search uploaded files…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            className="admin-dash__btn admin-dash__btn--dark"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>

        {statusMessage ? <p className="admin-cms-status">{statusMessage}</p> : null}
        {loadError ? <p className="admin-cms-error">{loadError}</p> : null}

        {loading ? (
          <div className="admin-cms-loading">Loading media…</div>
        ) : filteredFiles.length === 0 ? (
          <div className="admin-media__empty">
            <p>{query ? "No files match your search." : "No media uploaded yet."}</p>
            {!query ? (
              <button
                type="button"
                className="admin-dash__btn admin-dash__btn--light"
                onClick={() => inputRef.current?.click()}
              >
                Upload your first image
              </button>
            ) : null}
          </div>
        ) : (
          <div className="admin-media__grid">
            {filteredFiles.map((file) => (
              <article key={`${file.key}-${file.url}`} className="admin-media-card">
                <div className="admin-media-card__preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.name} loading="lazy" />
                </div>
                <div className="admin-media-card__body">
                  <p className="admin-media-card__name" title={file.name}>
                    {file.name}
                  </p>
                  <p className="admin-media-card__url" title={file.url}>
                    {file.url}
                  </p>
                  <div className="admin-media-card__actions">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-dash__btn admin-dash__btn--light"
                    >
                      Open
                    </a>
                    <button
                      type="button"
                      className="admin-dash__btn admin-dash__btn--dark"
                      onClick={() => void copyUrl(file.url)}
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        </div>
      </div>
    </AdminWorkspaceLayout>
  );
}
