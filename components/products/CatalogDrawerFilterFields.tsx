"use client";

import { useMemo, useState } from "react";
import { CATALOG_COLOR_PALETTE } from "@/lib/catalog-card-display";
import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";
import { formatPkr } from "@/lib/format-price";

const VISIBLE_COLOR_COUNT = 10;

type CatalogDrawerFilterFieldsProps = {
  filters: CatalogFilters;
  data: CatalogPageData;
  onChange: (next: CatalogFilters) => void;
  idPrefix?: string;
  variant?: "drawer" | "page";
};

function toggleColor(list: string[], color: string): string[] {
  const normalized = color.toUpperCase();
  const exists = list.some((item) => item.toUpperCase() === normalized);
  if (exists) {
    return list.filter((item) => item.toUpperCase() !== normalized);
  }
  return [...list, color];
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 12.5l3.5 3.5L18 8"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CatalogDrawerFilterFields({
  filters,
  data,
  onChange,
  idPrefix = "drawer",
  variant = "drawer",
}: CatalogDrawerFilterFieldsProps) {
  const searchId = `${idPrefix}-catalog-search`;
  const colourId = `${idPrefix}-filter-colour`;
  const priceId = `${idPrefix}-filter-price`;
  const [showAllColors, setShowAllColors] = useState(false);

  const priceMinBound = data.priceRange.min;
  const priceMaxBound = data.priceRange.max;
  const priceSpan = Math.max(priceMaxBound - priceMinBound, 1);
  const minPercent = ((filters.priceMin - priceMinBound) / priceSpan) * 100;
  const maxPercent = ((filters.priceMax - priceMinBound) / priceSpan) * 100;

  const visibleColors = useMemo(
    () =>
      showAllColors
        ? CATALOG_COLOR_PALETTE
        : CATALOG_COLOR_PALETTE.slice(0, VISIBLE_COLOR_COUNT),
    [showAllColors],
  );

  const hasMoreColors = CATALOG_COLOR_PALETTE.length > VISIBLE_COLOR_COUNT;

  const updatePriceMin = (value: number) => {
    onChange({
      ...filters,
      priceMin: Math.min(value, filters.priceMax),
      page: 1,
    });
  };

  const updatePriceMax = (value: number) => {
    onChange({
      ...filters,
      priceMax: Math.max(value, filters.priceMin),
      page: 1,
    });
  };

  if (variant === "page") {
    return (
      <div className="mk-catalog-page-filters">
        <span className="mk-catalog-drawer-filters__label mk-catalog-page-filters__search-label">
          Search
        </span>
        <label
          className="mk-catalog-drawer-filters__search mk-catalog-page-filters__search-input"
          htmlFor={searchId}
        >
          <span className="mk-catalog-drawer-filters__search-icon">
            <SearchIcon />
          </span>
          <input
            id={searchId}
            type="search"
            value={filters.searchQuery}
            placeholder="Search sofas, chairs, tables..."
            onChange={(event) =>
              onChange({
                ...filters,
                searchQuery: event.target.value,
                page: 1,
              })
            }
          />
        </label>

        <span className="mk-catalog-drawer-filters__label mk-catalog-page-filters__price-label">
          Price range
        </span>
        <p className="mk-catalog-drawer-filters__price-heading mk-catalog-page-filters__price-values">
          <strong>{formatPkr(filters.priceMin)}</strong>
          <span aria-hidden="true"> — </span>
          <strong>{formatPkr(filters.priceMax)}</strong>
        </p>

        <div className="mk-catalog-page-filters__colour-label-wrap">
          <span className="mk-catalog-drawer-filters__label mk-catalog-page-filters__colour-label">
            Colour
          </span>
        </div>

        <div className="mk-catalog-page-filters__colour" id={colourId}>
          <div className="mk-catalog-drawer-filters__colors">
            {visibleColors.map((swatch) => {
              const isActive = filters.selectedColors.some(
                (color) => color.toUpperCase() === swatch.color.toUpperCase(),
              );
              const isLight =
                swatch.color.toUpperCase() === "#FFFFFF" ||
                swatch.color.toUpperCase() === "#F1D858";
              return (
                <button
                  key={swatch.color}
                  type="button"
                  className={
                    isActive
                      ? "mk-catalog-drawer-filters__color is-active"
                      : "mk-catalog-drawer-filters__color"
                  }
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.title}
                  aria-label={`Filter by ${swatch.title}`}
                  aria-pressed={isActive}
                  onClick={() =>
                    onChange({
                      ...filters,
                      selectedColors: toggleColor(filters.selectedColors, swatch.color),
                      page: 1,
                    })
                  }
                >
                  {isActive ? (
                    <span
                      className={
                        isLight
                          ? "mk-catalog-drawer-filters__color-check is-dark"
                          : "mk-catalog-drawer-filters__color-check"
                      }
                    >
                      <CheckIcon />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {hasMoreColors ? (
            <button
              type="button"
              className="mk-catalog-drawer-filters__more-colors"
              onClick={() => setShowAllColors((open) => !open)}
            >
              <span aria-hidden="true">{showAllColors ? "−" : "+"}</span>
              {showAllColors ? "Show fewer colours" : "More colours"}
            </button>
          ) : null}
        </div>

        <div className="mk-catalog-page-filters__price-slider" id={priceId}>
          <div
            className="mk-catalog-drawer-filters__price-track-wrap"
            style={
              {
                "--range-left": `${minPercent}%`,
                "--range-right": `${100 - maxPercent}%`,
              } as React.CSSProperties
            }
          >
            <div className="mk-catalog-drawer-filters__price-track">
              <div className="mk-catalog-drawer-filters__price-track-fill" />
            </div>
            <input
              type="range"
              min={priceMinBound}
              max={priceMaxBound}
              step={Math.max(1, Math.round(priceSpan / 100))}
              value={filters.priceMin}
              className="mk-catalog-drawer-filters__range mk-catalog-drawer-filters__range--min"
              aria-label="Minimum price"
              onChange={(event) => updatePriceMin(Number(event.target.value))}
            />
            <input
              type="range"
              min={priceMinBound}
              max={priceMaxBound}
              step={Math.max(1, Math.round(priceSpan / 100))}
              value={filters.priceMax}
              className="mk-catalog-drawer-filters__range mk-catalog-drawer-filters__range--max"
              aria-label="Maximum price"
              onChange={(event) => updatePriceMax(Number(event.target.value))}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-catalog-drawer-filters">
      <div className="mk-catalog-drawer-filters__section">
        <span className="mk-catalog-drawer-filters__label">Search</span>
        <label className="mk-catalog-drawer-filters__search" htmlFor={searchId}>
          <span className="mk-catalog-drawer-filters__search-icon">
            <SearchIcon />
          </span>
          <input
            id={searchId}
            type="search"
            value={filters.searchQuery}
            placeholder="Search sofas, chairs, tables..."
            onChange={(event) =>
              onChange({
                ...filters,
                searchQuery: event.target.value,
                page: 1,
              })
            }
          />
        </label>
      </div>

      <div className="mk-catalog-drawer-filters__section" id={colourId}>
        <span className="mk-catalog-drawer-filters__label">Colour</span>
        <div className="mk-catalog-drawer-filters__colors">
          {visibleColors.map((swatch) => {
            const isActive = filters.selectedColors.some(
              (color) => color.toUpperCase() === swatch.color.toUpperCase(),
            );
            const isLight =
              swatch.color.toUpperCase() === "#FFFFFF" ||
              swatch.color.toUpperCase() === "#F1D858";
            return (
              <button
                key={swatch.color}
                type="button"
                className={
                  isActive
                    ? "mk-catalog-drawer-filters__color is-active"
                    : "mk-catalog-drawer-filters__color"
                }
                style={{ backgroundColor: swatch.color }}
                title={swatch.title}
                aria-label={`Filter by ${swatch.title}`}
                aria-pressed={isActive}
                onClick={() =>
                  onChange({
                    ...filters,
                    selectedColors: toggleColor(filters.selectedColors, swatch.color),
                    page: 1,
                  })
                }
              >
                {isActive ? (
                  <span
                    className={
                      isLight
                        ? "mk-catalog-drawer-filters__color-check is-dark"
                        : "mk-catalog-drawer-filters__color-check"
                    }
                  >
                    <CheckIcon />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {hasMoreColors ? (
          <button
            type="button"
            className="mk-catalog-drawer-filters__more-colors"
            onClick={() => setShowAllColors((open) => !open)}
          >
            <span aria-hidden="true">{showAllColors ? "−" : "+"}</span>
            {showAllColors ? "Show fewer colours" : "More colours"}
          </button>
        ) : null}
      </div>

      <div className="mk-catalog-drawer-filters__section" id={priceId}>
        <span className="mk-catalog-drawer-filters__label">Price range</span>
        <p className="mk-catalog-drawer-filters__price-heading">
          <strong>{formatPkr(filters.priceMin)}</strong>
          <span aria-hidden="true"> — </span>
          <strong>{formatPkr(filters.priceMax)}</strong>
        </p>
        <div
          className="mk-catalog-drawer-filters__price-track-wrap"
          style={
            {
              "--range-left": `${minPercent}%`,
              "--range-right": `${100 - maxPercent}%`,
            } as React.CSSProperties
          }
        >
          <div className="mk-catalog-drawer-filters__price-track">
            <div className="mk-catalog-drawer-filters__price-track-fill" />
          </div>
          <input
            type="range"
            min={priceMinBound}
            max={priceMaxBound}
            step={Math.max(1, Math.round(priceSpan / 100))}
            value={filters.priceMin}
            className="mk-catalog-drawer-filters__range mk-catalog-drawer-filters__range--min"
            aria-label="Minimum price"
            onChange={(event) => updatePriceMin(Number(event.target.value))}
          />
          <input
            type="range"
            min={priceMinBound}
            max={priceMaxBound}
            step={Math.max(1, Math.round(priceSpan / 100))}
            value={filters.priceMax}
            className="mk-catalog-drawer-filters__range mk-catalog-drawer-filters__range--max"
            aria-label="Maximum price"
            onChange={(event) => updatePriceMax(Number(event.target.value))}
          />
        </div>
        <div className="mk-catalog-drawer-filters__price-boxes">
          <span className="mk-catalog-drawer-filters__price-box">
            {formatPkr(filters.priceMin)}
          </span>
          <span className="mk-catalog-drawer-filters__price-box">
            {formatPkr(filters.priceMax)}
          </span>
        </div>
      </div>
    </div>
  );
}
