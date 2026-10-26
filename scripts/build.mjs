// Builds the profile README artwork into ./dist (deployed to GitHub Pages by the workflow).
//   node scripts/build.mjs            fetch live data
//   node scripts/build.mjs --offline  use scripts/sample-days.json (for local previews)
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { prepareCalendar } from "./lib/calendar.mjs";
import { renderScene } from "./lib/scene.mjs";
import { THEMES, LINKS, renderLink, renderTech, renderVisits } from "./lib/panels.mjs";
import { fetchContributions, fetchVisitors } from "./lib/fetch.mjs";

const USER = process.env.PROFILE_USER ?? "VishnuDatta510";
const offline = process.argv.includes("--offline");
const out = fileURLToPath(new URL("../dist/", import.meta.url));

const days = offline
  ? JSON.parse(await readFile(new URL("./sample-days.json", import.meta.url), "utf8"))
  : await fetchContributions(USER);
const visitors = offline ? "1,284" : await fetchVisitors(USER);

const cal = prepareCalendar(days);
const files = {
  "header.svg": renderScene(cal, {
    name: "Vishnu Datta",
    tagline: "CS student at IIIT Sri City · Ex-SDE at Soundverse AI",
  }),
};
for (const [mode, theme] of Object.entries(THEMES)) {
  files[`tech-${mode}.svg`] = renderTech(theme);
  if (visitors) files[`visits-${mode}.svg`] = renderVisits(theme, visitors);
  LINKS.forEach((link, i) => (files[`link-${link.key}-${mode}.svg`] = renderLink(link, i, theme)));
}

await mkdir(out, { recursive: true });
await Promise.all(Object.entries(files).map(([name, svg]) => writeFile(out + name, svg)));
await writeFile(out + "index.html", "<!doctype html><title>profile art</title><p>Artwork for the VishnuDatta510 profile README.");
console.log(`built ${Object.keys(files).length} files, ${cal.total} contributions, visitors: ${visitors ?? "n/a"}`);
