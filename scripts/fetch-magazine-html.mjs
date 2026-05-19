import fs from "fs";
import https from "https";

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

const listHtml = await fetch("https://www.scavolini.com/ww/magazine");
const articleHtml = await fetch(
  "https://www.scavolini.com/ww/furnishing-the-kitchen-and-bathroom-in-the-same-colour",
);

fs.writeFileSync("scripts/out-magazine-list.html", listHtml);
fs.writeFileSync("scripts/out-magazine-article.html", articleHtml);

for (const [name, html] of [
  ["list", listHtml],
  ["article", articleHtml],
]) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const sections = [...main.matchAll(/<section[^>]*class="([^"]*)"/gi)].map(
    (m) => m[1],
  );
  console.log(`\n=== ${name} sections ===`);
  sections.forEach((s) => console.log(s));
}
