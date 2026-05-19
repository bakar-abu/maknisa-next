import fs from "fs";
import path from "path";

const refDir = path.resolve("../scavolini-full/www.scavolini.com/ww");
const slugs = [
  "kitchens",
  "bathrooms",
  "living",
  "bedroom-furniture",
  "tables-chairs-stools",
  "formalia-outdoor",
  "multi-functional-modules",
  "inspire-me",
];

for (const slug of slugs) {
  const file = path.join(refDir, `${slug}.html`);
  const h = fs.readFileSync(file, "utf8");
  const i = h.indexOf("var appSettings");
  const end = h.indexOf(";(function", i);
  const block = h.slice(i, end > i ? end : i + 5000);
  const h1 = h.match(/<h1 class="[^"]*">([^<]+)</);
  const intro = h.match(
    /<p style="text-align: center;">([\s\S]*?)<\/p>/,
  );
  console.log("\n===", slug, "===");
  console.log("h1:", h1?.[1]?.trim());
  const cat = block.match(/appSettings\.category=\[([^\]]+)\]/);
  console.log("category:", cat?.[1]?.slice(0, 120));
  const activeCat = block.match(/appSettings\.activeCategory=(\d+)/);
  console.log("activeCategory:", activeCat?.[1]);
  const tagCount = (block.match(/LK_ID/g) || []).length;
  console.log("tags in settings:", tagCount);
}
