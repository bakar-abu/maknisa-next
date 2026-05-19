import fs from "fs";

const list = fs.readFileSync("scripts/out-magazine-list.html", "utf8");
const article = fs.readFileSync("scripts/out-magazine-article.html", "utf8");

const mainList = list.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
const grid = mainList.match(
  /<section class="sn_grid_magazine[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
)?.[1];

if (grid) {
  const cards = [...grid.matchAll(/<article[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/article>/gi)];
  console.log("cards count", cards.length);
  if (cards[0]) {
    const a = cards[0][2];
    const title = a.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
    const href = a.match(/href="([^"]+)"/)?.[1];
    const abstract = a.match(/class="abstract"[^>]*>([\s\S]*?)<\//i)?.[1]?.replace(/<[^>]+>/g, "").trim();
    console.log("sample:", { title, href, abstract: abstract?.slice(0, 80) });
  }
}

const mainArticle = article.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
const intro = mainArticle.match(
  /<section class="sn_intro_text[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
)?.[1];
if (intro) {
  console.log("\narticle intro snippet:", intro.slice(0, 800).replace(/\s+/g, " "));
}
