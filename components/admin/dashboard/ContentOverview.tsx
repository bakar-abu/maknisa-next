"use client";

import { useMemo, useState } from "react";
import type { AdminUser } from "@/lib/admin-auth/user";
import {
  DEFAULT_CONTENT_TAB_ID,
  getAdminContentTabs,
  type ContentTab,
} from "@/lib/admin-content-pages";
import { HomeContentBuilder } from "@/components/admin/content/HomeContentBuilder";
import { CompanyContentBuilder } from "@/components/admin/content/CompanyContentBuilder";
import { SupportContentBuilder } from "@/components/admin/content/SupportContentBuilder";
import { MagazineContentManager } from "@/components/admin/content/MagazineContentManager";
import { InspireMeContentBuilder } from "@/components/admin/content/InspireMeContentBuilder";
import { CatalogueContentBuilder } from "@/components/admin/content/CatalogueContentBuilder";
import { companySlugFromAdminPath } from "@/lib/cms/company-page";
import { supportSlugFromAdminPath } from "@/lib/cms/support-page";
import { AdminWorkspaceLayout } from "./AdminWorkspaceLayout";

type ContentOverviewProps = {
  user: AdminUser;
};

export function ContentOverview({ user }: ContentOverviewProps) {
  const tabs = useMemo(() => getAdminContentTabs(), []);
  const [activeTabId, setActiveTabId] = useState(DEFAULT_CONTENT_TAB_ID);
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(null);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const subTabs = activeTab.children ?? [];
  const resolvedSubTabId =
    activeSubTabId && subTabs.some((tab) => tab.id === activeSubTabId)
      ? activeSubTabId
      : (subTabs[0]?.id ?? null);

  const activeSubTab = subTabs.find((tab) => tab.id === resolvedSubTabId);
  const companySlug =
    activeTabId === "company" && activeSubTab
      ? companySlugFromAdminPath(activeSubTab.path)
      : null;
  const supportSlug =
    activeTabId === "support" && activeSubTab
      ? supportSlugFromAdminPath(activeSubTab.path)
      : null;

  function selectMainTab(tab: ContentTab) {
    setActiveTabId(tab.id);
    setActiveSubTabId(tab.children?.[0]?.id ?? null);
  }

  return (
    <AdminWorkspaceLayout
      user={user}
      title="Content"
      breadcrumbs={[
        { label: "Home", href: "/maknisa-admin/dashboard" },
        { label: "Content" },
      ]}
    >
      <div className="admin-catalog__layout">
        <aside className="admin-catalog__services-sidebar" aria-label="Website pages">
          <h2 className="admin-catalog__services-title">Pages</h2>
          <ul className="admin-catalog__services-list">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  className={`admin-catalog__service-btn${
                    activeTabId === tab.id ? " is-active" : ""
                  }`}
                  onClick={() => selectMainTab(tab)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {subTabs.length > 0 ? (
            <>
              <h2 className="admin-catalog__services-title admin-catalog__services-title--sub">
                {activeTab.label}
              </h2>
              <ul className="admin-catalog__services-list admin-catalog__services-list--sub">
                {subTabs.map((subTab) => (
                  <li key={subTab.id}>
                    <button
                      type="button"
                      className={`admin-catalog__service-btn admin-catalog__service-btn--sub${
                        resolvedSubTabId === subTab.id ? " is-active" : ""
                      }`}
                      onClick={() => setActiveSubTabId(subTab.id)}
                    >
                      {subTab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </aside>

        <div className="admin-catalog__builder-wrap">
          <div className="admin-dash__content-body" aria-live="polite">
            {activeTabId === "home" ? <HomeContentBuilder /> : null}
            {companySlug && activeSubTab ? (
              <CompanyContentBuilder
                key={companySlug}
                companySlug={companySlug}
                pageLabel={activeSubTab.label}
              />
            ) : null}
            {supportSlug && activeSubTab ? (
              <SupportContentBuilder
                key={supportSlug}
                supportSlug={supportSlug}
                pageLabel={activeSubTab.label}
              />
            ) : null}
            {activeTabId === "magazine" ? <MagazineContentManager /> : null}
            {activeTabId === "inspire-me" ? <InspireMeContentBuilder /> : null}
            {activeTabId === "catalogue" ? <CatalogueContentBuilder /> : null}
          </div>
        </div>
      </div>
    </AdminWorkspaceLayout>
  );
}
