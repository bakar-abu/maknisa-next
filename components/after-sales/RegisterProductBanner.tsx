"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "maknisa-after-sales-register-banner";

type RegisterProductBannerProps = {
  title: string;
  body: string;
  cta: { label: string; href: string };
};

export function RegisterProductBanner({
  title,
  body,
  cta,
}: RegisterProductBannerProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      setHidden(true);
    }
  }, []);

  const dismiss = () => {
    setHidden(true);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <section
      className={`sn_banner_register pb-30${hidden ? " _hidden" : ""}`}
    >
      <div className="container">
        <div className="sn_banner_register_in p-30 bg-primary text-white">
          <button
            type="button"
            className="sn_banner_register_close"
            onClick={dismiss}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="sn_banner_register_ct">
            <div className="h6 _color_inherit mb-10">{title}</div>
            <div className="sn_paragraph_props _color_inherit">{body}</div>
          </div>
          <div className="sn_banner_register_link">
            <Link
              href={cta.href}
              className="sn_btn_grow _light"
              title={cta.label}
            >
              <span className="tx">{cta.label}</span>
              <span
                className="sq"
                aria-hidden="true"
                data-title={cta.label}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
