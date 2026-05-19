"use client";

import { Icon } from "@/components/icons/Icon";

type HeaderSearchProps = {
  onClose: () => void;
};

export function HeaderSearch({ onClose }: HeaderSearchProps) {
  return (
    <div className="sn_header_search_popup">
      <div className="sn_header_search_popup_wr">
        <div className="search_header">
          <button
            type="button"
            className="search_toggle close"
            aria-label="Close search"
            onClick={onClose}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className="search_body">
          <form
            action="/collections"
            method="get"
            autoComplete="off"
            className="sn_form"
          >
            <div className="input_wr form-group _floating_label">
              <label htmlFor="txtSiteSearch">Search</label>
              <input
                type="text"
                className="form-control"
                name="txtSiteSearch"
                id="txtSiteSearch"
              />
              <button type="submit" aria-label="Search">
                <Icon id="search" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
