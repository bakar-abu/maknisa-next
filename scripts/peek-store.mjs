import fs from "fs";
const t = fs.readFileSync("scripts/out-company-scavolini-store.html", "utf8");
console.log(t.slice(0, 4000));
