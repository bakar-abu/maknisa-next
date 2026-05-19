import fs from "fs";

const html = fs.readFileSync("public/www.scavolini.com/ww/index.html", "utf8");
const re = /<section class="sn_box-txt[^"]*"[\s\S]*?<\/section>/g;
const matches = [...html.matchAll(re)];
matches.forEach((m, i) => {
  console.log("=== box-txt", i, "===");
  console.log(m[0]);
});
