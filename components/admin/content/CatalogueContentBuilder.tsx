"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATALOGUE_PAGE_SLUG,
  CATALOGUE_SECTION_DEFINITIONS,
  getCataloguePageDefaults,
} from "@/lib/cms/catalogue-page";
import type { PageContent } from "@/lib/cms/page-content";
import { AdminCmsPreviewStyles } from "@/components/admin/content/AdminCmsPreviewStyles";
import { CmsAccordionSection } from "@/components/admin/content/CmsAccordionSection";
import { CatalogueSectionEditModal } from "./CatalogueSectionEditModal";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";
import { HomeSeoPanel } from "./HomeSeoPanel";

export function CatalogueContentBuilder() {
  const defaults = useMemo(() => getCataloguePageDefaults(), []);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<PageContent>(defaults);
  const [seoDraft, setSeoDraft] = useState(defaults.seo);
  const [seoDirty, setSeoDirty] = useState(false);
  const [seoConfirmOpen, setSeoConfirmOpen] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    CATALOGUE_SECTION_DEFINITIONS[0]?.id ?? null,
  );
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [savingSeo, setSavingSeo] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setStatusMessage(null);
      try {
        const response = await fetch(`/api/admin/content/${CATALOGUE_PAGE_SLUG}`);
        if (!response.ok) throw new Error("Failed to load Catalogue content.");
        const data = (await response.json()) as PageContent;
        setPage(data);
        setSeoDraft(data.seo);
        setSeoDirty(false);
      } catch {
        setPage(defaults);
        setSeoDraft(defaults.seo);
        setStatusMessage("Using default content. Save to publish to the database.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [defaults]);

  const editingSection = CATALOGUE_SECTION_DEFINITIONS.find(
    (section) => section.id === editingSectionId,
  );

  async function saveSeo() {
    setSavingSeo(true);
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/admin/content/${CATALOGUE_PAGE_SLUG}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoDraft),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to save SEO settings.");
      }
      setPage((current) => ({ ...current, seo: seoDraft }));
      setSeoDirty(false);
      setSeoConfirmOpen(false);
      setStatusMessage("SEO settings saved.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save SEO.");
    } finally {
      setSavingSeo(false);
    }
  }

  async function saveSection(sectionId: string, content: unknown) {
    setSavingSection(true);
    setStatusMessage(null);
    try {
      const response = await fetch(
        `/api/admin/content/${CATALOGUE_PAGE_SLUG}/sections/${sectionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to save section.");
      }
      setPage((current) => ({
        ...current,
        sections: { ...current.sections, [sectionId]: content },
      }));
      setStatusMessage("Section saved. The live Catalogue page will update shortly.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to save section.",
      );
      throw error;
    } finally {
      setSavingSection(false);
    }
  }

  if (loading) {
    return <div className="admin-cms-loading">Loading Catalogue content…</div>;
  }

  return (
    <div className="admin-cms-builder">
      <AdminCmsPreviewStyles />
      {statusMessage ? <p className="admin-cms-status">{statusMessage}</p> : null}

      <HomeSeoPanel
        seo={seoDraft}
        dirty={seoDirty}
        saving={savingSeo}
        onChange={(next) => {
          setSeoDraft(next);
          setSeoDirty(true);
        }}
        onSave={() => setSeoConfirmOpen(true)}
      />

      <div className="admin-cms-sections">
        {CATALOGUE_SECTION_DEFINITIONS.map((section) => {
          const isOpen = openSectionId === section.id;

          return (
            <CmsAccordionSection
              key={section.id}
              label={section.label}
              description={section.description}
              isOpen={isOpen}
              onToggle={() =>
                setOpenSectionId((current) =>
                  current === section.id ? null : section.id,
                )
              }
              onEdit={() => setEditingSectionId(section.id)}
            >
              <p>
                Manage the <strong>{section.label}</strong> block on the Catalogue
                landing page.
              </p>
              <code className="admin-cms-accordion__path">
                Page slug: {CATALOGUE_PAGE_SLUG} · Section ID: {section.id}
              </code>
            </CmsAccordionSection>
          );
        })}
      </div>

      {editingSection ? (
        <CatalogueSectionEditModal
          key={editingSection.id}
          open
          sectionId={editingSection.id}
          sectionLabel={editingSection.label}
          content={page.sections[editingSection.id]}
          saving={savingSection}
          onClose={() => setEditingSectionId(null)}
          onSave={(content) => saveSection(editingSection.id, content)}
        />
      ) : null}

      <ConfirmSaveDialog
        open={seoConfirmOpen}
        title="Save SEO changes?"
        message="This will update SEO for the Catalogue page."
        saving={savingSeo}
        onCancel={() => setSeoConfirmOpen(false)}
        onConfirm={() => void saveSeo()}
      />
    </div>
  );
}
