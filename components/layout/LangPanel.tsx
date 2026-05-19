"use client";

import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { languages } from "@/lib/navigation";

type LangPanelProps = {
  onToggle: () => void;
};

export function LangPanel({ onToggle }: LangPanelProps) {
  return (
    <div className="sn_langs">
      <div className="sn_langs_panel">
        <div className="sn_langs_panel_head">
          <div className="text-right mb-20">
            <button
              type="button"
              className="sn_langs_panel_close"
              data-langs-toggle
              aria-label="Close language panel"
              onClick={onToggle}
            >
              <Icon id="close" />
            </button>
          </div>
          Select your language:
        </div>
        <div className="sn_langs_panel_body" tabIndex={-1}>
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`sn_langs_panel_i${"active" in lang && lang.active ? " _active" : ""}`}
            >
              {"external" in lang && lang.external ? (
                <a href={lang.href} target="_blank" rel="noopener noreferrer">
                  {lang.label}
                </a>
              ) : (
                <Link href={lang.href} onClick={onToggle}>
                  {lang.label}
                  {"active" in lang && lang.active ? <Icon id="tick" /> : null}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="sn_langs_backdrop"
        data-langs-toggle
        aria-label="Close language panel backdrop"
        onClick={onToggle}
      />
    </div>
  );
}
