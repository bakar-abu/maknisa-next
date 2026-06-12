"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDrawerSectionsForCategory,
  QUICK_FILTER_CHIPS,
} from "@/lib/catalog-drawer-filters";
import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";
import type { GridCollectionSlug } from "@/lib/collections";
import { PRICE_TIER_BOUNDS } from "@/lib/catalog-types";
import { formatPkr } from "@/lib/format-price";

type CatalogFiltersDrawerProps = {
  open: boolean;
  data: CatalogPageData;
  filters: CatalogFilters;
  activeCategoryId: string | null;
  resultCount: number;
  initialSection?: string | null;
  onClose: () => void;
  onChange: (next: CatalogFilters) => void;
  onApply: () => void;
};

function toggleId(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

function toggleString(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

export function CatalogFiltersDrawer({
  open,
  data,
  filters,
  activeCategoryId,
  resultCount,
  initialSection,
  onClose,
  onChange,
  onApply,
}: CatalogFiltersDrawerProps) {
  const [expanded, setExpanded] = useState<string[]>(["colour", "material", "price"]);

  const categorySections = getDrawerSectionsForCategory(activeCategoryId);
  const colourTags = data.tags.slice(0, Math.ceil(data.tags.length / 2));
  const materialTags = data.tags.slice(Math.ceil(data.tags.length / 2));

  useEffect(() => {
    if (open && initialSection) {
      setExpanded((prev) =>
        prev.includes(initialSection) ? prev : [...prev, initialSection],
      );
    }
  }, [open, initialSection]);

  const toggleSection = useCallback((id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const updateDrawerOption = useCallback(
    (sectionId: string, optionId: string) => {
      const current = filters.drawerFilters[sectionId] ?? [];
      onChange({
        ...filters,
        drawerFilters: {
          ...filters.drawerFilters,
          [sectionId]: toggleString(current, optionId),
        },
        page: 1,
      });
    },
    [filters, onChange],
  );

  if (!open) return null;

  return (
    <div className="mk-catalog-drawer-root" role="presentation">
      <button
        type="button"
        className="mk-catalog-drawer-backdrop"
        aria-label="Close filters"
        onClick={onClose}
      />
      <aside
        className="mk-catalog-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <header className="mk-catalog-drawer__head">
          <div className="mk-catalog-drawer__title-wrap">
            <span className="mk-catalog-drawer__icon" aria-hidden="true">
              ☰
            </span>
            <h2 className="mk-catalog-drawer__title">Filters</h2>
          </div>
          <button
            type="button"
            className="mk-catalog-drawer__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="mk-catalog-drawer__chips">
          {QUICK_FILTER_CHIPS.map((chip) => (
            <button key={chip.id} type="button" className="mk-catalog-drawer__chip">
              {chip.label}
            </button>
          ))}
        </div>

        <div className="mk-catalog-drawer__body">
          <AccordionSection
            id="colour"
            label="Colour"
            expanded={expanded.includes("colour")}
            onToggle={toggleSection}
          >
            <div className="mk-catalog-drawer__options">
              {colourTags.map((tag) => (
                <label key={tag.id} className="mk-catalog-drawer__option">
                  <input
                    type="checkbox"
                    checked={filters.tagIds.includes(tag.id)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        tagIds: toggleId(filters.tagIds, tag.id),
                        page: 1,
                      })
                    }
                  />
                  <span>{tag.label}</span>
                </label>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection
            id="material"
            label="Material"
            expanded={expanded.includes("material")}
            onToggle={toggleSection}
          >
            <div className="mk-catalog-drawer__options">
              {(materialTags.length ? materialTags : colourTags).map((tag) => (
                <label key={`m-${tag.id}`} className="mk-catalog-drawer__option">
                  <input
                    type="checkbox"
                    checked={filters.tagIds.includes(tag.id)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        tagIds: toggleId(filters.tagIds, tag.id),
                        page: 1,
                      })
                    }
                  />
                  <span>{tag.label}</span>
                </label>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection
            id="collection"
            label="Collection"
            expanded={expanded.includes("collection")}
            onToggle={toggleSection}
          >
            <div className="mk-catalog-drawer__options">
              {data.rooms.map((room) => (
                <label key={room.slug} className="mk-catalog-drawer__option">
                  <input
                    type="checkbox"
                    checked={filters.roomSlugs.includes(room.slug)}
                    onChange={() =>
                      onChange({
                        ...filters,
                        roomSlugs: toggleString(
                          filters.roomSlugs,
                          room.slug,
                        ) as GridCollectionSlug[],
                        page: 1,
                      })
                    }
                  />
                  <span>{room.label}</span>
                </label>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection
            id="price"
            label="Price"
            expanded={expanded.includes("price")}
            onToggle={toggleSection}
          >
            <div className="mk-catalog-drawer__price">
              <p className="mk-catalog-drawer__price-values">
                {formatPkr(filters.priceMin)} – {formatPkr(filters.priceMax)}
              </p>
              <div className="mk-catalog-drawer__price-tiers">
                {Object.values(PRICE_TIER_BOUNDS).map((tier) => (
                  <button
                    key={tier.label}
                    type="button"
                    className="mk-catalog-drawer__price-btn"
                    onClick={() =>
                      onChange({
                        ...filters,
                        priceMin: tier.min,
                        priceMax: tier.max,
                        page: 1,
                      })
                    }
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </AccordionSection>

          {categorySections.map((section) => (
            <AccordionSection
              key={section.id}
              id={section.id}
              label={section.label}
              expanded={expanded.includes(section.id)}
              onToggle={toggleSection}
            >
              <div className="mk-catalog-drawer__options">
                {section.options.map((option) => (
                  <label key={option.id} className="mk-catalog-drawer__option">
                    <input
                      type="checkbox"
                      checked={(filters.drawerFilters[section.id] ?? []).includes(
                        option.id,
                      )}
                      onChange={() => updateDrawerOption(section.id, option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </AccordionSection>
          ))}
        </div>

        <footer className="mk-catalog-drawer__footer">
          <button type="button" className="mk-catalog-drawer__apply" onClick={onApply}>
            Show {resultCount} products
          </button>
        </footer>
      </aside>
    </div>
  );
}

function AccordionSection({
  id,
  label,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  expanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="mk-catalog-drawer__section">
      <button
        type="button"
        className="mk-catalog-drawer__section-head"
        onClick={() => onToggle(id)}
        aria-expanded={expanded}
      >
        <span>{label}</span>
        <span className="mk-catalog-drawer__chevron" aria-hidden="true">
          {expanded ? "▴" : "▾"}
        </span>
      </button>
      {expanded ? <div className="mk-catalog-drawer__section-body">{children}</div> : null}
    </section>
  );
}
