import fs from "fs";
import path from "path";

const refDir = path.resolve("../scavolini-full/www.scavolini.com/ww");
const outDir = path.resolve("lib/collection-data");

const collections = {
  kitchens: { categoryIds: [17], file: "kitchens.html" },
  bathrooms: { categoryIds: [12], file: "bathrooms.html" },
  living: { categoryIds: [13], file: "living.html" },
  "bedroom-furniture": { categoryIds: [190], file: "bedroom-furniture.html" },
  "tables-chairs-stools": {
    categoryIds: [229, 230, 231],
    file: "tables-chairs-stools.html",
  },
  "multi-functional-modules": {
    categoryIds: [18],
    file: "multi-functional-modules.html",
  },
};

const sharedCategories = [
  { id: 17, label: "Kitchens", href: "/ww/kitchens" },
  { id: 12, label: "Bathrooms", href: "/ww/bathrooms" },
  { id: 13, label: "Living", href: "/ww/living" },
  { id: 190, label: "Night", href: "/ww/bedroom-furniture" },
  { id: 18, label: "Multi-functional modules", href: "/ww/multi-functional-modules" },
];

const tablesCategories = [
  { id: 229, label: "Tables", href: "/ww/tables-chairs-stools" },
  { id: 230, label: "Chairs", href: "/ww/tables-chairs-stools" },
  { id: 231, label: "Stools", href: "/ww/tables-chairs-stools" },
];

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeImage(src) {
  let url = decodeHtml(src);
  if (url.startsWith("../../scavolini-cdn"))
    url = "https://" + url.replace(/^\.\.\/\.\.\//, "");
  if (url.startsWith("/"))
    url = `https://www.scavolini.com${url}`;
  return url;
}

function extractTags(html) {
  const tags = [];
  const re =
    /<a href="[^"]*" class="sn_kitchen_tags_i[^"]*" data-tag="(\d+)">([^<]*)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    const id = Number(m[1]);
    const label = decodeHtml(m[2].trim());
    if (!tags.find((t) => t.id === id)) tags.push({ id, label });
  }
  return tags;
}

function extractProducts(html, categoryIds, slug) {
  const products = [];
  const chunks = html.split(/<div class="sn_kitchen_i\s/);
  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i];
    const titleM = chunk.match(
      /sn_kitchen_i_title[^>]*>[\s\S]*?<span>([^<]+)<\/span>/,
    );
    if (!titleM) continue;
    const hrefM = chunk.match(/sn_kitchen_i_link[^"]*" href="([^"]+)"/);
    const online = chunk.includes("sn_kitchen_i_tag");
    const images = [];
    const imgRe = /(?:data-src|src)="([^"]+)"/g;
    let im;
    while ((im = imgRe.exec(chunk))) {
      const src = normalizeImage(im[1]);
      if (src.includes("scavolini-cdn") && !images.includes(src)) images.push(src);
    }
    const tagIds = [];
    const tagRe = /data-tag="(\d+)"/g;
    let tm;
    while ((tm = tagRe.exec(chunk))) tagIds.push(Number(tm[1]));

    const productId = `${titleM[1].trim().toLowerCase().replace(/\W+/g, "-")}-${i}`;
    const href = `/ww/${slug}/${productId}`;

    products.push({
      id: productId,
      title: titleM[1].trim(),
      href,
      onlineShop: online,
      images,
      tagIds: [...new Set(tagIds)],
      categoryIds,
    });
  }
  return products;
}

function extractMeta(html, slug) {
  const h1 = html.match(/<h1 class="[^"]*m-0">([^<]+)</)?.[1]?.trim();
  const introHtml = html.match(/<p style="text-align: center;">([\s\S]*?)<\/p>/)?.[1];
  const intro = introHtml
    ? introHtml
        .replace(/<a[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g, "$2")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";
  const title = html.match(/<title>([^<|]+)/)?.[1]?.trim();
  return {
    h1,
    intro,
    title: title || h1 || slug,
    breadcrumbLabel:
      slug === "bedroom-furniture"
        ? "Night"
        : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const index = {};

for (const [slug, cfg] of Object.entries(collections)) {
  const file = path.join(refDir, cfg.file);
  const html = fs.readFileSync(file, "utf8");
  const tags = extractTags(html);
  const products = extractProducts(html, cfg.categoryIds, slug);
  const meta = extractMeta(html, slug);
  const categories =
    slug === "tables-chairs-stools" ? tablesCategories : sharedCategories;

  const data = {
    slug,
    type: "grid",
    ...meta,
    tags,
    products,
    categories,
    primaryCategoryIds: cfg.categoryIds,
    itemsPerPage: 12,
    maxVisibleTags: 5,
  };

  fs.writeFileSync(
    path.join(outDir, `${slug}.json`),
    JSON.stringify(data, null, 2),
  );
  index[slug] = { productCount: products.length, tagCount: tags.length, h1: meta.h1 };
  console.log(slug, products.length, "products");
}

// Maknisa: marble & tiles, lighting (from kitchens/bathrooms imagery)
const samplePool = JSON.parse(
  fs.readFileSync(path.join(outDir, "kitchens.json"), "utf8"),
).products;

function cloneProducts(pool, prefix, categoryIds, count = 12) {
  return pool.slice(0, count).map((p, i) => ({
    ...p,
    id: `${prefix}-${i + 1}`,
    categoryIds,
  }));
}

const marbleTiles = {
  slug: "marble-tiles",
  type: "grid",
  title: "Marble & Tiles | Maknisa",
  h1: "Looking for marble & tiles?",
  intro:
    "Explore premium marble, porcelain, and floor tiles for kitchens, bathrooms, and living spaces — curated by Maknisa for Pakistani homes.",
  breadcrumbLabel: "Marble & Tiles",
  tags: [
    { id: 9001, label: "Marble" },
    { id: 9002, label: "Porcelain" },
    { id: 9003, label: "Floor" },
    { id: 9004, label: "Wall" },
    { id: 9005, label: "Kitchen" },
    { id: 9006, label: "Bathroom" },
  ],
  products: cloneProducts(samplePool, "tile", [901]).map((p, i) => ({
    ...p,
    title: `Tile Collection ${i + 1}`,
    tagIds: [9001 + (i % 6)],
  })),
  categories: [],
  primaryCategoryIds: [901],
  itemsPerPage: 12,
  maxVisibleTags: 6,
};

const lighting = {
  slug: "lighting",
  type: "grid",
  title: "Lighting | Maknisa",
  h1: "Looking for lighting?",
  intro:
    "Discover chandeliers, pendants, and ambient lighting to complete your Maknisa interior projects.",
  breadcrumbLabel: "Lighting",
  tags: [
    { id: 9101, label: "Pendant" },
    { id: 9102, label: "Chandelier" },
    { id: 9103, label: "LED" },
    { id: 9104, label: "Modern" },
    { id: 9105, label: "Classic" },
  ],
  products: cloneProducts(samplePool, "light", [902]).map((p, i) => ({
    ...p,
    title: `Lighting ${i + 1}`,
    tagIds: [9101 + (i % 5)],
  })),
  categories: [],
  primaryCategoryIds: [902],
  itemsPerPage: 12,
  maxVisibleTags: 5,
};

fs.writeFileSync(
  path.join(outDir, "marble-tiles.json"),
  JSON.stringify(marbleTiles, null, 2),
);
fs.writeFileSync(
  path.join(outDir, "lighting.json"),
  JSON.stringify(lighting, null, 2),
);
index["marble-tiles"] = { productCount: marbleTiles.products.length, h1: marbleTiles.h1 };
index.lighting = { productCount: lighting.products.length, h1: lighting.h1 };

fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index, null, 2));
console.log("done");
