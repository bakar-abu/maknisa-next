"use client";

import { useId, useState } from "react";
import type { StoreLocation } from "@/lib/company-pages";

export function CompanyStoresGrid({ stores }: { stores: StoreLocation[] }) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="sn_exhibitions mt-100 mt-lg-200 mb-80 mb-lg-40">
      <div className="container">
        <div className="row text-center mb-60">
          <div className="col-12">
            <h1 className="h1 m-0">Maknisa Stores</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className={`sn_accordion_grid_grid _stores_accordion_${baseId}`}>
              <div className="row mb-lg-30">
                {stores.map((store) => {
                  const collapseId = `${baseId}-${store.id}`;
                  const isOpen = openId === store.id;

                  return (
                    <div
                      key={store.id}
                      className="sn_accordion_grid_i col-6 col-lg-3 mb-30 mt-30 mt-lg-0"
                    >
                      <button
                        type="button"
                        className={`sn_accordion_grid_toggle w-100 text-left ${
                          isOpen ? "" : "collapsed"
                        }`}
                        aria-expanded={isOpen}
                        aria-controls={collapseId}
                        onClick={() =>
                          setOpenId(isOpen ? null : store.id)
                        }
                      >
                        <figure>
                          <picture>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={store.image}
                              alt=""
                              className="img-fluid"
                              loading="lazy"
                            />
                          </picture>
                        </figure>
                        <div className="title mt-10">
                          <span>{store.city}</span>
                          <span className="indicator" />
                        </div>
                      </button>
                      <div
                        className={`sn_accordion_grid_collapse collapse col-12 order-lg-last ${
                          isOpen ? "show" : ""
                        }`}
                        id={collapseId}
                      >
                        <div className="sn_accordion_grid_collapse_in py-30 py-lg-60">
                          <div className="row">
                            <div className="col-12 col-md-10 col-lg-8 mx-auto">
                              <h2 className="h4 mb-20">{store.title}</h2>
                              <div className="sn_paragraph">
                                <p>{store.address}</p>
                                {store.phone ? (
                                  <p>
                                    T:{" "}
                                    <a href={`tel:${store.phone.replace(/\s/g, "")}`}>
                                      {store.phone}
                                    </a>
                                  </p>
                                ) : null}
                                {store.email ? (
                                  <p>
                                    e-mail:{" "}
                                    <a href={`mailto:${store.email}`}>
                                      {store.email}
                                    </a>
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
