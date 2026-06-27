import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distIndex = join("dist", "index.html");
const assetsDir = "assets";
const distAssetsDir = join("dist", "assets");

if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true });
}

for (const fileName of readdirSync(assetsDir)) {
  if (fileName.startsWith("index-")) {
    rmSync(join(assetsDir, fileName), { force: true });
  }
}

copyFileSync(distIndex, "index.html");
copyFileSync(distIndex, "about.html");
copyFileSync(distIndex, "404.html");

for (const fileName of readdirSync(distAssetsDir)) {
  copyFileSync(join(distAssetsDir, fileName), join(assetsDir, fileName));
}

if (!existsSync(".nojekyll")) {
  writeFileSync(".nojekyll", "");
}
