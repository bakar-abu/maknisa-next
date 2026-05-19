import fs from "fs";

const file = process.argv[2];
const html = fs.readFileSync(file, "utf8");

// Extract appSettings tags
const tagsBlock = html.match(/appSettings\.tags=\[([\s\S]*?)\];/);
const tags = [];
if (tagsBlock) {
  const re =
    /\{LK_ID:(\d+),LK_Descrizione:"[^"]*",LK_Valore:"([^"]*)",LK_ORDINE:\d+\}/g;
  let m;
  while ((m = re.exec(tagsBlock[1]))) {
    tags.push({ id: Number(m[1]), label: m[2] });
  }
}

// Try embedded items in script
const itemsMatch = html.match(/appSettings\.items\s*=\s*(\[[\s\S]*?\]);/);
let items = [];
if (itemsMatch) {
  try {
    items = Function(`"use strict"; return (${itemsMatch[1]})`)();
  } catch {
    console.log("items parse failed");
  }
}

// Parse rendered cards if present
const cardRe =
  /<div class="sn_kitchen_i"[\s\S]*?<span>([^<]*)<\/span>[\s\S]*?href="([^"]+)"[\s\S]*?data-tag="(\d+)"/g;
const cards = [];
let c;
while ((c = cardRe.exec(html))) {
  cards.push({ title: c[1], href: c[2], tag: c[3] });
}

console.log("tags", tags.length);
console.log("appSettings.items", items.length);
console.log("rendered cards", cards.length);
if (items[0]) console.log("sample item keys", Object.keys(items[0]));
if (items[0]) console.log(JSON.stringify(items[0], null, 2).slice(0, 800));

// Extract images from swiper in cards - alternative pattern
const titleRe =
  /sn_kitchen_i_title mb-10">\s*<span>([^<]+)<\/span>/g;
const titles = [];
while ((m = titleRe.exec(html))) titles.push(m[1]);
console.log("titles from html", titles.length, titles.slice(0, 8));
