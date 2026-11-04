import type {
  CatalogProductAdminRecord,
  CatalogServiceBundle,
  CatalogServiceCategoryRecord,
} from "@/lib/cms/catalog-admin";
import { mediaUrl } from "@/lib/media";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function productsByCategory(
  bundle: CatalogServiceBundle,
): { category: CatalogServiceCategoryRecord | null; products: CatalogProductAdminRecord[] }[] {
  const serviceId = bundle.service.id;
  const uncategorized: CatalogProductAdminRecord[] = [];

  const buckets: {
    category: CatalogServiceCategoryRecord | null;
    products: CatalogProductAdminRecord[];
  }[] = bundle.categories.map((category) => ({
    category,
    products: bundle.products.filter((product) => {
      const assignment = product.serviceAssignments.find((item) => item.serviceId === serviceId);
      return assignment?.primaryCategoryId === category.id;
    }),
  }));

  for (const product of bundle.products) {
    const assignment = product.serviceAssignments.find((item) => item.serviceId === serviceId);
    if (!assignment?.primaryCategoryId) {
      uncategorized.push(product);
    }
  }

  if (uncategorized.length > 0) {
    buckets.push({ category: null, products: uncategorized });
  }

  return buckets.filter((bucket) => bucket.products.length > 0);
}

export function downloadServiceCataloguePdf(bundle: CatalogServiceBundle): void {
  const { service } = bundle;
  const sections = productsByCategory(bundle);

  const sectionHtml = sections
    .map((section) => {
      const heading = section.category?.heading ?? section.category?.label ?? "Collection";
      const cards = section.products
        .map((product) => {
          const image = product.images[0]?.url;
          const intro = product.content?.intro ?? "";
          return `
            <article class="catalogue-pdf__card">
              <div class="catalogue-pdf__card-media">
                ${
                  image
                    ? `<img src="${escapeHtml(mediaUrl(image))}" alt="${escapeHtml(product.title)}" />`
                    : `<div class="catalogue-pdf__card-placeholder">Maknisa</div>`
                }
              </div>
              <h3>${escapeHtml(product.title)}</h3>
              ${intro ? `<p>${escapeHtml(intro.slice(0, 180))}${intro.length > 180 ? "…" : ""}</p>` : ""}
            </article>
          `;
        })
        .join("");

      return `
        <section class="catalogue-pdf__section">
          <p class="catalogue-pdf__kicker">Maknisa ${escapeHtml(service.label)}</p>
          <h2>${escapeHtml(heading)}</h2>
          <div class="catalogue-pdf__grid">${cards}</div>
        </section>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(service.title)} Catalogue | Maknisa</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Montserrat", "Helvetica Neue", Arial, sans-serif;
      color: #1a1d21;
      background: #fff;
    }
    .catalogue-pdf__cover {
      min-height: 92vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 0 0 8mm;
      page-break-after: always;
      background: linear-gradient(180deg, #fff8f1 0%, #ffffff 55%);
    }
    .catalogue-pdf__brand {
      font-size: 11px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #f99106;
      margin-bottom: 10mm;
    }
    .catalogue-pdf__cover h1 {
      font-size: 34px;
      line-height: 1.1;
      margin: 0 0 8mm;
      max-width: 80%;
    }
    .catalogue-pdf__cover p {
      font-size: 14px;
      line-height: 1.7;
      color: #4b5563;
      max-width: 70%;
      margin: 0;
    }
    .catalogue-pdf__section {
      page-break-before: always;
      padding-top: 4mm;
    }
    .catalogue-pdf__kicker {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #f99106;
      margin: 0 0 4mm;
    }
    .catalogue-pdf__section h2 {
      font-size: 24px;
      margin: 0 0 10mm;
    }
    .catalogue-pdf__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8mm;
    }
    .catalogue-pdf__card {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .catalogue-pdf__card-media {
      aspect-ratio: 4 / 3;
      overflow: hidden;
      border-radius: 8px;
      background: #f3f4f6;
      margin-bottom: 4mm;
    }
    .catalogue-pdf__card-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .catalogue-pdf__card-placeholder {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      color: #9ca3af;
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .catalogue-pdf__card h3 {
      font-size: 14px;
      margin: 0 0 2mm;
    }
    .catalogue-pdf__card p {
      font-size: 11px;
      line-height: 1.55;
      color: #6b7280;
      margin: 0;
    }
    .catalogue-pdf__footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 9px;
      color: #9ca3af;
      padding: 4mm 0;
    }
    @media screen {
      body { padding: 24px; max-width: 900px; margin: 0 auto; }
    }
  </style>
</head>
<body>
  <section class="catalogue-pdf__cover">
    <div class="catalogue-pdf__brand">Maknisa Catalogue</div>
    <h1>${escapeHtml(service.h1 || service.title)}</h1>
    <p>${escapeHtml(service.intro)}</p>
  </section>
  ${sectionHtml}
  <div class="catalogue-pdf__footer">maknisa.com · ${escapeHtml(service.label)} catalogue</div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 400);
    });
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    throw new Error("Pop-up blocked. Allow pop-ups to download the catalogue PDF.");
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
