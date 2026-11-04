"use client";

import { useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";
import { uploadAdminImage } from "../../upload-image";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "/media/... or https://...",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAdminImage(file);
      onChange(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-cms-media-card">
      {value ? (
        <div className="admin-cms-media-card__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(value)} alt={label} />
        </div>
      ) : null}
      <div className="admin-cms-media-card__body">
        <label className="admin-cms-field">
          <span>{label}</span>
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
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
          className="admin-dash__btn admin-dash__btn--dark admin-cms-media-card__upload"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        {error ? <p className="admin-cms-error">{error}</p> : null}
      </div>
    </div>
  );
}
