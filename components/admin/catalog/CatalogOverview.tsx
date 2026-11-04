"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUser } from "@/lib/admin-auth/user";
import type { CatalogServiceRecord } from "@/lib/cms/catalog-admin";
import { AdminWorkspaceLayout } from "@/components/admin/dashboard/AdminWorkspaceLayout";
import { CatalogServiceBuilder } from "./CatalogServiceBuilder";

const SERVICE_SWITCH_DEBOUNCE_MS = 300;

type CatalogOverviewProps = {
  user: AdminUser;
};

export function CatalogOverview({ user }: CatalogOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<CatalogServiceRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [hasInitialSelection, setHasInitialSelection] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/catalog/services", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        services?: CatalogServiceRecord[];
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Failed to load services.");
      const list = data.services ?? [];
      setServices(list);
      setSelectedId((current) => current ?? list[0]?.id ?? null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (!selectedId) {
      setActiveServiceId(null);
      return;
    }

    if (!hasInitialSelection) {
      setActiveServiceId(selectedId);
      setHasInitialSelection(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveServiceId(selectedId);
    }, SERVICE_SWITCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [selectedId, hasInitialSelection]);

  const activeService = services.find((service) => service.id === selectedId);
  const isSwitching = Boolean(selectedId && activeServiceId !== selectedId);

  return (
    <AdminWorkspaceLayout
      user={user}
      title="Catalog"
      breadcrumbs={[
        { label: "Home", href: "/maknisa-admin/dashboard" },
        { label: "Catalog" },
      ]}
    >
      {statusMessage ? <p className="admin-cms-status">{statusMessage}</p> : null}

      {loading ? (
        <div className="admin-cms-loading">Loading catalog…</div>
      ) : loadError ? (
        <div className="admin-cms-error">
          <p>{loadError}</p>
          <button type="button" className="admin-dash__btn admin-dash__btn--light" onClick={() => void loadServices()}>
            Retry
          </button>
        </div>
      ) : (
        <div className="admin-catalog__layout">
          <aside className="admin-catalog__services-sidebar" aria-label="Services">
            <h2 className="admin-catalog__services-title">Services</h2>
            <ul className="admin-catalog__services-list">
              {services.map((service) => (
                <li key={service.id}>
                  <button
                    type="button"
                    className={`admin-catalog__service-btn${
                      selectedId === service.id ? " is-active" : ""
                    }`}
                    onClick={() => setSelectedId(service.id)}
                  >
                    {service.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="admin-catalog__builder-wrap">
            {isSwitching ? (
              <div className="admin-cms-loading">Loading {activeService?.label ?? "service"}…</div>
            ) : activeServiceId && activeService ? (
              <div className="admin-dash__content-body">
                <CatalogServiceBuilder
                  key={activeServiceId}
                  serviceId={activeServiceId}
                  onStatus={setStatusMessage}
                />
              </div>
            ) : (
              <div className="admin-cms-loading">Select a service to manage its catalogue.</div>
            )}
          </div>
        </div>
      )}
    </AdminWorkspaceLayout>
  );
}
