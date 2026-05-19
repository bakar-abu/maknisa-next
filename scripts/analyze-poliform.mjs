import fs from "fs";

const html = fs.readFileSync(process.env.TEMP + "/poliform-joan.html", "utf8");

const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
const body = mainMatch ? mainMatch[0] : html;

const sectionRe = /<section[^>]*class="([^"]*)"[^>]*>/gi;
const sections = [];
let m;
while ((m = sectionRe.exec(body))) {
  sections.push(m[1].split(/\s+/).slice(0, 4).join(" "));
}

console.log("=== SECTIONS (first class tokens) ===");
[...new Set(sections)].slice(0, 40).forEach((s) => console.log(s));

const divClasses = new Set();
const classRe = /class="([^"]{5,120})"/g;
while ((m = classRe.exec(body))) {
  m[1].split(/\s+/).forEach((c) => {
    if (
      /product|hero|gallery|slider|breadcrumb|related|catalog|config|technical|grid|layout|sticky|mobile|desktop/i.test(
        c,
      )
    )
      divClasses.add(c);
  });
}
console.log("\n=== KEY CLASSES ===");
[...divClasses].sort().slice(0, 80).forEach((c) => console.log(c));

const hTags = [];
for (const tag of ["h1", "h2", "h3"]) {
  const re = new RegExp(`<${tag}[^>]*>([^<]{1,80})`, "gi");
  let h;
  while ((h = re.exec(body))) hTags.push(`${tag}: ${h[1].trim()}`);
}
console.log("\n=== HEADINGS ===");
hTags.slice(0, 20).forEach((h) => console.log(h));

// CSS files
const cssLinks = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((x) => x[1]);
console.log("\n=== CSS FILES ===");
cssLinks.slice(0, 15).forEach((u) => console.log(u));

// data attributes / components
const dataComp = [...html.matchAll(/data-([a-z-]+)=/gi)].map((x) => x[1]);
const freq = {};
for (const d of dataComp) freq[d] = (freq[d] || 0) + 1;
console.log("\n=== DATA ATTRIBUTES (top) ===");
Object.entries(freq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 25)
  .forEach(([k, v]) => console.log(v, k));

// Save main excerpt
const idx = body.indexOf("<h1");
console.log("\nmain from h1 length", body.length - idx);
fs.writeFileSync(
  "scripts/out-poliform-joan-main.html",
  body.slice(Math.max(0, idx - 2000), idx + 25000),
);
