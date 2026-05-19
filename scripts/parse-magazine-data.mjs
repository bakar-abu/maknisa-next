import fs from "fs";

const listHtml = fs.readFileSync("scripts/out-magazine-list.html", "utf8");

const categories = [];
const catBlock = listHtml.match(/sn_grid_magazine_categories">([\s\S]*?)<\/div>/i)?.[1];
if (catBlock) {
  for (const m of catBlock.matchAll(
    /<a href="([^"]*)"[^>]*title="([^"]*)"[^>]*>([^<]*)</gi,
  )) {
    categories.push({
      href: m[1].replace("https://www.scavolini.com", ""),
      title: m[2],
      label: m[3].trim(),
    });
  }
}

const articles = [];
const rowMatch = listHtml.match(/sn_grid_magazine_row row">([\s\S]*?)<\/div>\s*<\/div>\s*<\/form>/i);
const row = rowMatch?.[1] ?? listHtml;

for (const col of row.matchAll(
  /sn_grid_magazine_col[^>]*>[\s\S]*?<\/motion.div>\s*<\/div>/gi,
)) {
  // fallback: split by sn_magazine_i
}

for (const block of listHtml.split("sn_grid_magazine_col")) {
  if (!block.includes("sn_magazine_i_title")) continue;
  const id = block.match(/id="post-title-(\d+)"/)?.[1];
  const title = block
    .match(/class="sn_magazine_i_title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i)?.[1]
    ?.replace(/<[^>]+>/g, "")
    .trim();
  const href = block.match(/href="(\/ww\/[^"]+)"/)?.[1];
  const excerpt = block
    .match(/class="sn_magazine_i_content[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    ?.replace(/<[^>]+>/g, "")
    .trim();
  const categoryHref = block.match(/class="sn_magazine_i_label"[^>]*href="([^"]+)"/)?.[1];
  const categoryLabel = block
    .match(/class="sn_magazine_i_label"[^>]*>([^<]+)</i)?.[1]
    ?.trim();
  const img = block.match(/<img src="([^"]+)"/)?.[1];
  const isLarge = block.includes("col-lg-8");

  if (!title || !href) continue;
  articles.push({
    id: id ?? String(articles.length + 1),
    slug: href.replace(/^\/ww\//, "").replace(/^\//, ""),
    title,
    excerpt,
    href,
    category: { href: categoryHref, label: categoryLabel },
    image: img,
    large: isLarge,
  });
}

const unique = [];
const seen = new Set();
for (const a of articles) {
  if (seen.has(a.slug)) continue;
  seen.add(a.slug);
  unique.push(a);
}

console.log("categories", categories.length);
console.log("articles", unique.length);
fs.writeFileSync(
  "lib/magazine-data.json",
  JSON.stringify({ categories, articles: unique.slice(0, 24) }, null, 2),
);
