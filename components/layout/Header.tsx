"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { useBodyClass } from "@/hooks/useBodyClass";
import { CATALOGUE_HREF } from "@/lib/catalogue";
import {
  companyMenu,
  serviceLinks,
  servicesMenu,
} from "@/lib/navigation";
import { site } from "@/lib/site";
import { HeaderSearch } from "./HeaderSearch";
import { LangPanel } from "./LangPanel";
import { NavDropdown } from "./NavDropdown";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);

  useBodyClass("_menu_open", mobileOpen);
  useBodyClass("open", langsOpen);
  useBodyClass("h-noscroll", mobileOpen || langsOpen || searchOpen);
  useBodyClass("_search_open", searchOpen);

  const toggleMobile = useCallback(() => {
    setSearchOpen(false);
    setLangsOpen(false);
    setMobileOpen((v) => !v);
  }, []);

  const toggleSearch = useCallback(() => {
    setMobileOpen(false);
    setLangsOpen(false);
    setSearchOpen((v) => !v);
  }, []);

  const toggleLangs = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setLangsOpen((v) => !v);
  }, []);

  return (
    <>
      <header className="sn_header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-auto">
              <Link href="/" className="sn_header_logo" title={site.title}>
                <Image
                  src="/images/logo-maknisa.png"
                  alt={site.name}
                  width={80}
                  height={80}
                  className="sn_header_logo_img"
                  priority
                />
              </Link>
            </div>
            <div className="col">
              <div className="sn_header_menu">
                <div className="row">
                  <div className="col-12 col-lg-auto d-lg-flex align-items-center">
                    <div className="sn_header_menu_primary">
                      <ul>
                        <NavDropdown group={servicesMenu} />
                        <NavDropdown group={companyMenu} />
                        <li>
                          <Link
                            href={CATALOGUE_HREF}
                            title="Product catalogue | Maknisa"
                          >
                            Catalogue
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="sn_header_search">
                      <button
                        type="button"
                        className="sn_header_search_toggle"
                        aria-label="Search"
                        onClick={toggleSearch}
                      >
                        <Icon id="search" className="_search" />
                      </button>
                    </div>
                  </div>
                  <div className="col-12 col-lg-auto ml-auto d-lg-flex align-items-center mt-50 mt-lg-0">
                    <div className="sn_header_menu_service">
                      <ul>
                        {serviceLinks.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} title={link.title}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="sn_header_langs">
                      <button
                        type="button"
                        data-langs-toggle
                        aria-label="Current language: English"
                        onClick={toggleLangs}
                      >
                        WW <Icon id="angle-down" className="_angle_down" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto ml-auto d-lg-none">
              <div
                className="sn_header_hamburger sn_header_toggle"
                role="button"
                tabIndex={0}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={toggleMobile}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMobile();
                  }
                }}
              >
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="sn_header_spacer" />
      <div className="sn_header_sizer" />

      <HeaderSearch onClose={() => setSearchOpen(false)} />
      <LangPanel onToggle={toggleLangs} />
    </>
  );
}
