import test from "node:test";
import assert from "node:assert/strict";
import { parseCalendar } from "./lib/fetch.mjs";
import { prepareCalendar } from "./lib/calendar.mjs";
import { renderScene } from "./lib/scene.mjs";
import { readFileSync } from "node:fs";

const html = `<table><tbody><tr>
<td tabindex="-1" data-ix="0" aria-selected="false" aria-describedby="contribution-graph-legend-level-1" style="width: 10px" data-date="2025-11-02" id="contribution-day-component-0-0" data-level="1" role="gridcell" class="ContributionCalendar-day"></td>
<td data-date="2025-11-03" id="contribution-day-component-1-0" data-level="0" role="gridcell" class="ContributionCalendar-day"></td>
</tr></tbody></table>
<tool-tip id="tooltip-1" for="contribution-day-component-0-0" popover="manual" data-direction="n">12 contributions on November 2nd.</tool-tip>
<tool-tip id="tooltip-2" for="contribution-day-component-1-0" popover="manual" data-direction="n">No contributions on November 3rd.</tool-tip>`;

test("parses cells, counts and levels from GitHub's calendar markup", () => {
  assert.deepEqual(parseCalendar(html), [
    { date: "2025-11-02", count: 12, level: 1 },
    { date: "2025-11-03", count: 0, level: 0 },
  ]);
});

test("renders a scene from a year of days", () => {
  const days = JSON.parse(readFileSync(new URL("./sample-days.json", import.meta.url), "utf8"));
  const svg = renderScene(prepareCalendar(days), { name: "A & B", tagline: "t" });
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.ok(!svg.includes("NaN") && !svg.includes("undefined"));
  assert.ok(svg.includes("A &amp; B"));
});

test("copes with a quiet year and a short history", () => {
  const days = Array.from({ length: 40 }, (_, i) => ({ date: new Date(Date.UTC(2026, 8, 1 + i)).toISOString().slice(0, 10), count: 0, level: 0 }));
  const svg = renderScene(prepareCalendar(days), { name: "x", tagline: "y" });
  assert.ok(!svg.includes("NaN") && !svg.includes("undefined"));
});
