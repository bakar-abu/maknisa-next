import fs from "fs";

const html = fs.readFileSync("public/www.scavolini.com/ww/index.html", "utf8");

// Find main content sections in order
const mainStart = html.indexOf('<main');
const mainEnd = html.indexOf("</main>", mainStart);
const main = html.slice(mainStart, mainEnd);

const sectionRe = /<section[^>]*class="([^"]*)"[^>]*>/g;
let m;
const sections = [];
while ((m = sectionRe.exec(main))) {
  sections.push(m[1]);
}

console.log("=== SECTIONS IN MAIN ===");
sections.forEach((c, i) => console.log(i + 1, c));

// Also find top-level div sections with sn_ classes
const divRe = /<div[^>]*class="(sn_[^"]+)"[^>]*>/g;
const divs = new Set();
while ((m = divRe.exec(main))) {
  const cls = m[1].split(/\s+/).find((x) => x.startsWith("sn_"));
  if (cls) divs.add(cls);
}
console.log("\n=== SN_ DIV BLOCKS ===");
[...divs].sort().forEach((d) => console.log(d));
