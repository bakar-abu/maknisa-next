"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CatalogDrawerFilterFields } from "@/components/products/CatalogDrawerFilterFields";
import { ProductsActiveFilters } from "@/components/products/ProductsActiveFilters";
import { getDrawerSectionsForCategory } from "@/lib/catalog-drawer-filters";
import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";
import type { GridCollectionSlug } from "@/lib/collections";

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
  const bodyRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string[]>(["material", "collection"]);

  const categorySections = getDrawerSectionsForCategory(activeCategoryId);
  const colourTags = data.tags.slice(0, Math.ceil(data.tags.length / 2));
  const materialTags = data.tags.slice(Math.ceil(data.tags.length / 2));

  useEffect(() => {
    if (!open) return;

    if (initialSection === "material" || initialSection === "collection") {
      setExpanded((prev) =>
        prev.includes(initialSection) ? prev : [...prev, initialSection],
      );
    }

    const scrollTarget =
      initialSection === "colour"
        ? "drawer-filter-colour"
        : initialSection === "price"
          ? "drawer-filter-price"
          : initialSection
            ? `drawer-section-${initialSection}`
            : null;

    if (scrollTarget && bodyRef.current) {
      const node = bodyRef.current.querySelector(`#${scrollTarget}`);
      node?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        className="mk-catalog-drawer mk-catalog-drawer--filters"
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

        <div ref={bodyRef} className="mk-catalog-drawer__body">
          <div id="drawer-filter-search">
            <CatalogDrawerFilterFields
              filters={filters}
              data={data}
              onChange={onChange}
            />
          </div>

          <div className="mk-catalog-drawer__active-filters">
            <span className="mk-catalog-drawer-filters__label">Active filters</span>
            <ProductsActiveFilters
              data={data}
              filters={filters}
              onChange={onChange}
              variant="drawer"
            />
          </div>

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
    <section className="mk-catalog-drawer__section" id={`drawer-section-${id}`}>
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
