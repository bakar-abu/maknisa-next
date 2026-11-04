"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_DASHBOARD_PATH } from "@/lib/admin-auth/constants";
import { site } from "@/lib/site";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 6c3.6 0 6.7 2.1 8.2 5.2-.3.6-.7 1.1-1.1 1.6-1.3 1.6-3.2 2.8-5.3 3.4l1.5 1.5-1.4 1.4-16-16 1.4-1.4 3.5 3.5C5.5 8.4 8.5 6 12 6zm0 14c-3.6 0-6.7-2.1-8.2-5.2.6-1.1 1.4-2.1 2.3-2.9l2.9 2.9c.8.3 1.7.5 2.7.5 1 0 1.9-.2 2.7-.5l1.5 1.5c-1.2.5-2.5.7-3.9.7z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5C20.3 7.6 17 4.5 12 4.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"
      />
    </svg>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedId = identifier.trim();
    if (!trimmedId || !password) {
      setError("Please enter your username or mobile number and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: trimmedId,
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Sign in failed. Please try again.");
        return;
      }

      router.push(ADMIN_DASHBOARD_PATH);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__form-panel">
        <div className="admin-login__form-inner">
          <Link href="/" className="admin-login__logo" title={site.title}>
            <Image
              src="/images/logo-maknisa.png"
              alt={site.name}
              width={72}
              height={72}
              priority
            />
            <span className="admin-login__logo-text">{site.name}</span>
          </Link>

          <div className="admin-login__intro">
            <h1 className="admin-login__title">Sign in</h1>
            <p className="admin-login__subtitle">
              Manage website content, images, and catalog from the Maknisa admin
              panel.
            </p>
          </div>

          <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
            <div className="admin-login__field">
              <label htmlFor="admin-identifier">Username or mobile</label>
              <input
                id="admin-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="Enter username or mobile number"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="admin-login__field">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-login__password-wrap">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-login__password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error ? (
              <p className="admin-login__error" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="admin-login__submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="admin-login__footer">
            <Link href="/">← Back to {site.name} website</Link>
          </p>
        </div>
      </div>

      <div className="admin-login__visual-panel" aria-hidden="true">
        <div className="admin-login__visual-frame">
          <Image
            src="https://scavolini-cdn.thron.com/delivery/public/image/scavolini/2800ba9b-ba21-4e54-905f-b9046cf6b6b0/nuctwf/std/1280x0/Qualita.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="admin-login__visual-image"
            priority
          />

          <div className="admin-login__chip admin-login__chip--accent">
            <span className="admin-login__chip-label">Admin panel</span>
            <strong>Content &amp; catalog</strong>
          </div>

          <div className="admin-login__chip admin-login__chip--glass">
            <span className="admin-login__chip-days">
              <span>Kitchens</span>
              <span>Living</span>
              <span>Tiles</span>
              <span>Lights</span>
            </span>
          </div>

          <div className="admin-login__chip admin-login__chip--solid">
            <span className="admin-login__chip-label">Showrooms</span>
            <div className="admin-login__chip-avatars">
              <span>Lahore</span>
              <span>Karachi</span>
              <span>Islamabad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
