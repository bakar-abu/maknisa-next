import fs from "fs";
import path from "path";

const closeWrong = "</" + "motion.div>";
const openWrong = "<" + "motion.div";

for (const f of fs.readdirSync("components/company")) {
  if (!f.endsWith(".tsx")) continue;
  const p = path.join("components/company", f);
  let c = fs.readFileSync(p, "utf8");
  c = c.split(closeWrong).join("</" + "div>");
  c = c.split(openWrong).join("<" + "div");
  fs.writeFileSync(p, c);
}
