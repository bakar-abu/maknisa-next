"use client";

import type { TechModalTab } from "./ProductTechModal";

type ProductActionTilesProps = {
  onOpen: (tab: TechModalTab) => void;
};

const TILES: { tab: TechModalTab; label: string }[] = [
  { tab: "technical", label: "Technical sheet" },
  { tab: "downloads", label: "Downloads" },
  { tab: "certifications", label: "Certifications" },
  { tab: "configurate", label: "Configurate" },
];

function ExternalIcon() {
  return (
    <svg
      className="mk-pdp__action-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 1H4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4m-5-9h5m0 0v4.5M17 1 8.5 9.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductActionTiles({ onOpen }: ProductActionTilesProps) {
  return (
    <ul className="mk-pdp__actions">
      {TILES.map((tile) => (
        <li key={tile.tab}>
          <button
            type="button"
            className="mk-pdp__action-tile"
            onClick={() => onOpen(tile.tab)}
          >
            <h3 className="mk-pdp__action-title">{tile.label}</h3>
            <ExternalIcon />
          </button>
        </li>
      ))}
    </ul>
  );
}
