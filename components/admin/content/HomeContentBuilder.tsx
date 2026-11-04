"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getHomePageDefaults,
  HOME_PAGE_SLUG,
  HOME_SECTION_DEFINITIONS,
  type HomePageContent,
  type HomeSectionId,
  type HomeSeoContent,
} from "@/lib/cms/home-page";
import { AdminCmsPreviewStyles } from "@/components/admin/content/AdminCmsPreviewStyles";
import { CmsAccordionSection } from "@/components/admin/content/CmsAccordionSection";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";
import { HomeSeoPanel } from "./HomeSeoPanel";
import { SectionEditModal } from "./SectionEditModal";

export function HomeContentBuilder() {
  const defaults = useMemo(() => getHomePageDefaults(), []);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<HomePageContent>(defaults);
  const [seoDraft, setSeoDraft] = useState<HomeSeoContent>(defaults.seo);
  const [seoDirty, setSeoDirty] = useState(false);
  const [seoConfirmOpen, setSeoConfirmOpen] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    HOME_SECTION_DEFINITIONS[0]?.id ?? null,
  );
  const [editingSectionId, setEditingSectionId] = useState<HomeSectionId | null>(
    null,
  );
  const [savingSeo, setSavingSeo] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/admin/content/${HOME_PAGE_SLUG}`);
        if (!response.ok) throw new Error("Failed to load homepage content.");
        const data = (await response.json()) as HomePageContent;
        setPage(data);
        setSeoDraft(data.seo);
      } catch {
        setStatusMessage("Using default homepage content. Save to publish to the database.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const editingSection = HOME_SECTION_DEFINITIONS.find(
    (section) => section.id === editingSectionId,
  );

  async function saveSeo() {
    setSavingSeo(true);
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/admin/content/${HOME_PAGE_SLUG}/seo`, {
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
      setStatusMessage("SEO settings saved. The homepage metadata will update shortly.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to save SEO settings.",
      );
    } finally {
      setSavingSeo(false);
    }
  }

  async function saveSection(sectionId: HomeSectionId, content: unknown) {
    setSavingSection(true);
    setStatusMessage(null);
    try {
      const response = await fetch(
        `/api/admin/content/${HOME_PAGE_SLUG}/sections/${sectionId}`,
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
      setStatusMessage("Section saved. The live homepage will use the updated content.");
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
    return <div className="admin-cms-loading">Loading homepage content…</div>;
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
        {HOME_SECTION_DEFINITIONS.map((section) => {
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
                Manage the content shown in the <strong>{section.label}</strong>{" "}
                block on the Maknisa homepage.
              </p>
              <code className="admin-cms-accordion__path">Section ID: {section.id}</code>
            </CmsAccordionSection>
          );
        })}
      </div>

      {editingSection ? (
        <SectionEditModal
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
        message="This will update the homepage meta title, description, and robots settings on the live website."
        saving={savingSeo}
        onCancel={() => setSeoConfirmOpen(false)}
        onConfirm={() => void saveSeo()}
      />
    </div>
  );
}
