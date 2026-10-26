// Turns a flat list of contribution days into the 53 x 7 grid the scene draws.
import { rng } from "./util.mjs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const parseDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** days: [{ date: "YYYY-MM-DD", count: number, level: 0..4 }], sorted ascending. */
export function prepareCalendar(days) {
  if (!days.length) throw new Error("no contribution days to draw");
  const first = parseDate(days[0].date);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay()); // columns start on Sunday, like GitHub
  const index = (dt) => Math.round((dt - start) / 864e5);

  // right-align so the newest week is always the last column
  const lastWeek = Math.floor(index(parseDate(days[days.length - 1].date)) / 7);
  const shift = lastWeek + 1 - 53;

  const grid = Array.from({ length: 53 }, () => Array(7).fill(null));
  let total = 0;
  for (const day of days) {
    const dt = parseDate(day.date);
    const i = index(dt);
    const w = Math.floor(i / 7) - shift;
    if (w < 0 || w > 52) continue;
    grid[w][i % 7] = { n: day.count, l: day.level, date: dt };
    total += day.count;
  }

  const wk = grid.map((col) => col.reduce((s, g) => s + (g ? g.n : 0), 0));
  const maxWk = Math.max(1, ...wk);
  const peakW = wk.indexOf(Math.max(...wk));

  /** Month labels along the baseline, skipping ones that would crowd each other. */
  const lbl = (ox, y, step, cls) => {
    let out = "", prev = -1, lastW = -9;
    for (let w = 0; w < 53; w++) {
      const g = grid[w].find(Boolean);
      if (!g) continue;
      const m = g.date.getMonth();
      if (m !== prev) {
        if (w - lastW >= 3) {
          out += `<text class="${cls}" x="${ox + w * step}" y="${y}">${MONTHS[m]}</text>`;
          lastW = w;
        }
        prev = m;
      }
    }
    return out;
  };

  return { grid, total, wk, maxWk, peakW, lbl, RD: rng(77) };
}
