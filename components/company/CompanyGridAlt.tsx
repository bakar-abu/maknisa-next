import { GrowButton } from "@/components/home/shared/GrowButton";
import type { GridAltRow } from "@/lib/company-pages";

type CompanyGridAltProps = {
  sectionId?: string;
  title: string;
  intro: string;
  rows: GridAltRow[];
};

export function CompanyGridAlt({
  sectionId,
  title,
  intro,
  rows,
}: CompanyGridAltProps) {
  return (
    <section className="sn_grid_alt my-90 my-lg-180" id={sectionId}>
      <div className="container mb-60 mb-lg-120 text-center">
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8 mx-auto">
            <h2 className="h3 mb-20 mb-lg-40">{title}</h2>
            <div className="sn_paragraph_xxl">{intro}</div>
          </div>
        </div>
      </div>
      <div className="sn_grid_alt_ct">
        <div className="container">
          {rows.map((row) => (
            <div
              key={row.title}
              className={`row sn_grid_alt_row _${row.align}`}
            >
              <div
                className={`col-12 col-md-6 col-lg-5 offset-lg-1 ${
                  row.align === "left" ? "offset-md-1 order-md-last" : ""
                } ${row.align === "right" ? "text-md-right" : ""}`}
              >
                <div className="sn_grid_alt_row_in">
                  <div className="h3 mb-20 mb-lg-30">{row.title}</div>
                  <div className="sn_paragraph_lg">{row.body}</div>
                  {row.cta ? (
                    <GrowButton
                      href={row.cta.href}
                      label={row.cta.label}
                      className="sn_btn_grow mt-30 mt-lg-60"
                    />
                  ) : null}
                </div>
              </div>
              <div
                className={`col-12 col-md-5 ${
                  row.align === "right" ? "offset-md-1" : ""
                }`}
              >
                <figure>
                  <picture>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.image}
                      alt=""
                      className="_full"
                      loading="lazy"
                    />
                  </picture>
                </figure>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

