import fs from "fs";

const html = fs.readFileSync("public/www.scavolini.com/ww/index.html", "utf8");
const mainStart = html.indexOf("<main");
const mainEnd = html.indexOf("</main>", mainStart);
const main = html.slice(mainStart, mainEnd);

const className = process.argv[2];
if (!className) {
  console.error("Usage: node extract-home-section.mjs <class-substring>");
  process.exit(1);
}

const re = new RegExp(
  `<section[^>]*class="[^"]*${className}[^"]*"[^>]*>`,
  "i",
);
const match = re.exec(main);
if (!match) {
  console.error("Section not found:", className);
  process.exit(1);
}

const start = match.index;
let depth = 0;
let i = start;
while (i < main.length) {
  if (main.startsWith("<section", i)) depth++;
  if (main.startsWith("</section>", i)) {
    depth--;
    if (depth === 0) {
      const chunk = main.slice(start, i + "</section>".length);
      fs.writeFileSync(`scripts/out-${className.replace(/\W/g, "_")}.html`, chunk);
      console.log("Wrote", chunk.length, "chars");
      console.log(chunk.slice(0, 2000));
      break;
    }
  }
  i++;
}
