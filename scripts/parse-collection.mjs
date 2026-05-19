import fs from "fs";
import path from "path";

const refDir = path.resolve("../scavolini-full/www.scavolini.com/ww");
const slug = process.argv[2] || "kitchens";
const file = fs.existsSync(path.join(refDir, `${slug}.html`))
  ? path.join(refDir, `${slug}.html`)
  : path.join(refDir, `${slug}.html.tmp`);

let html = fs.readFileSync(file, "utf8");
const mainStart = html.indexOf("<main");
const mainEnd = html.indexOf("</main>", mainStart);
if (mainStart < 0) {
  console.error("No main in", file);
  process.exit(1);
}
const main = html.slice(mainStart, mainEnd + 7);

const sectionRe = /<section[^>]*class="([^"]+)"/g;
let m;
const sections = [];
while ((m = sectionRe.exec(main))) sections.push(m[1].split(/\s+/)[0]);

console.log("file:", file);
console.log("main length:", main.length);
console.log("sections:", [...new Set(sections)].join("\n"));

const filterMatch = main.match(/sn_filter[^"']*|data-filter|sn_products/gi);
console.log("filter keywords:", [...new Set(filterMatch || [])].slice(0, 20));

fs.writeFileSync(
  path.join("scripts", `out-collection-${slug}.html`),
  main.slice(0, 8000) + "\n<!-- truncated -->",
);
console.log("wrote preview");
