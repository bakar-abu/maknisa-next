import fs from "fs";

const html = fs.readFileSync(process.env.TEMP + "/poliform-joan.html", "utf8");
const start = html.indexOf('id="k-main"');
const end = html.indexOf("</main>", start + 100);
const chunk = html.slice(start, end);
fs.writeFileSync("scripts/out-poliform-k-main.html", chunk);

const headings = [...chunk.matchAll(/<h[1-6][^>]*>([^<]{1,120})/gi)].map((m) =>
  m[1].trim(),
);
console.log("k-main size", chunk.length);
console.log("H tags:", headings.join(" | "));

const sections = [
  "Technical Sheet",
  "Downloads",
  "Certifications",
  "Configurate",
  "Related Products",
  "Catalog",
  "Discover",
  "gallery-slider",
  "technical_data",
  "accordion",
  "fancybox",
  "js-gallery",
  "projects-item__hero",
  "crumbs",
];

for (const s of sections) {
  const i = chunk.indexOf(s);
  if (i >= 0) {
    const snippet = chunk
      .slice(Math.max(0, i - 80), i + 200)
      .replace(/\s+/g, " ");
    console.log("\n---", s, "---\n", snippet.slice(0, 280));
  }
}
