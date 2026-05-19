import Link from "next/link";
import { CompanyAccordion } from "@/components/company/CompanyAccordion";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { RegisterProductBanner } from "@/components/after-sales/RegisterProductBanner";
import { WarrantyAnchorNav } from "@/components/after-sales/WarrantyAnchorNav";
import { afterSalesContent } from "@/lib/after-sales";
import type { WarrantyBlock } from "@/lib/after-sales";

function WarrantyImageOverflow({ block }: { block: WarrantyBlock }) {
  return (
    <section
      className={`sn_image_text_overflow mb-90 mb-lg-120 _${block.align}`}
    >
      <div className="sn_image_text_overflow_ct">
        <div className="row">
          <div
            className={`col-12 col-md-5 col-xl-4${block.align === "right" ? " order-md-last offset-xl-1" : ""}`}
          >
            <figure>
              <picture>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.image}
                  alt=""
                  className="_full"
                  loading="lazy"
                />
              </picture>
            </figure>
          </div>
          <div
            className={`col-12 col-md${block.align === "left" ? " offset-xl-1" : ""} pt-100 pt-lg-150 pt-xl-200 _color_inherit`}
          >
            <div data-anchor-id={block.anchorId} />
            <div className="h2 mb-20 mb-lg-30">{block.title}</div>
            <div className="sn_paragraph_lg">
              <div className="text-primary">
                Guaranteed assistance for:{" "}
                {block.categories.map((cat, i) => (
                  <span key={cat}>
                    {i > 0 && " • "}
                    <strong>{cat}</strong>
                  </span>
                ))}
              </div>
              <br />
              {block.intro}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WarrantyBlockSection({ block }: { block: WarrantyBlock }) {
  return (
    <div
      className={`sn_warranties_i pb-100 pb-lg-150 pb-xl-200${block.bgLight ? " bg-light" : ""}`}
    >
      <WarrantyImageOverflow block={block} />

      {block.columns.length > 0 ? (
        <div className="container">
          <div className="row">
            <div className="col-12 mb-30 mb-lg-40 mb-xl-60">
              <div className="h4 mb-0">{block.peaceTitle}</div>
            </div>
            {block.columns.map((col, index) => (
              <div
                key={col.title}
                className={`col-12 col-md-6 col-lg-5 mb-30 mb-lg-40 mb-xl-60${index === 2 ? " offset-lg-1" : index === 1 ? " offset-lg-1" : ""}`}
              >
                <div className="sn_paragraph_lg">
                  <strong>{col.title}</strong>
                  <br />
                  {col.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <section className="mt-50 mt-lg-60">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-xl-8 mx-auto">
              <CompanyAccordion
                id={block.accordionId}
                sans
                items={block.faq}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function AfterSalesPage() {
  const c = afterSalesContent;

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_text my-60 my-lg-150 my-xl-200">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-12 mb-40">
              <MagazineBreadcrumbs items={[...c.breadcrumbs]} />
            </div>
            <div className="col-12">
              <h1 className="h1 m-0">{c.title}</h1>
            </div>
            <div className="col-12 col-lg-10 col-xl-8 mt-40 mx-md-0">
              <div className="sn_paragraph_xxl">
                {c.intro}
                <br />
                <br />
                If you need further assistance,{" "}
                <strong>
                  visit our{" "}
                  <Link href={c.customerCareHref}>{c.customerCareLabel}</Link>
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RegisterProductBanner
        title={c.registerBanner.title}
        body={c.registerBanner.body}
        cta={c.registerBanner.cta}
      />

      <section className="sn_warranties">
        <div className="sn_warranties_anchors mb-120 mb-md-140 mb-200">
          <div className="container text-center">
            <div className="row">
              <div className="col-12 col-md-10 col-lg-8 col-xl-6 mx-auto mb-30 mb-lg-40 mb-xl-60">
                <div className="h4 m-0">{c.anchorQuestion}</div>
              </div>
              <div className="w-100" />
              <div className="col-12 col-md-10 col-lg-8 col-xl-6 mx-auto">
                <WarrantyAnchorNav anchors={[...c.anchors]} />
              </div>
            </div>
          </div>
        </div>

        {c.warranties.map((block) => (
          <WarrantyBlockSection key={block.anchorId} block={block} />
        ))}
      </section>
    </main>
  );
}
