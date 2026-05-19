import fs from "fs";
import path from "path";

const refPath = path.resolve(
  "../scavolini-full/www.scavolini.com/ww/after-sales-services.html.tmp",
);
const html = fs.readFileSync(refPath, "utf8");
const mainStart = html.indexOf("<main");
const mainEnd = html.indexOf("</main>", mainStart);
const main = html.slice(mainStart, mainEnd);

console.log("main length", main.length);

const sectionRe = /<section[^>]*class="([^"]+)"/g;
let m;
while ((m = sectionRe.exec(main))) {
  console.log(m[1]);
}

const outPath = path.join("scripts", "out-after-sales-main.html");
fs.writeFileSync(outPath, main);
console.log("wrote", outPath);
