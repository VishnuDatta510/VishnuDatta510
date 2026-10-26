// Network side of the build: GitHub's public contribution calendar and the komarev visitor counter.

/** Parse the HTML fragment served at github.com/users/<user>/contributions into sorted day records. */
export function parseCalendar(html) {
  const attr = (tag, name) => {
    const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
    return m ? m[1] : null;
  };

  // "3 contributions on May 2nd." keyed by the id of the cell the tooltip belongs to
  const tips = new Map();
  for (const m of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attr(m[1], "for");
    if (id) tips.set(id, m[2].replace(/<[^>]*>/g, "").trim());
  }

  const days = [];
  for (const m of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
    const date = attr(m[0], "data-date");
    if (!date) continue;
    const tip = tips.get(attr(m[0], "id")) ?? "";
    const count = /^\s*(\d+)/.exec(tip)?.[1];
    days.push({ date, count: count ? Number(count) : 0, level: Number(attr(m[0], "data-level") ?? 0) });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

export async function fetchContributions(user) {
  const res = await fetch(`https://github.com/users/${user}/contributions`, {
    headers: { "User-Agent": "profile-readme-build/1.0" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`contributions request failed: ${res.status}`);
  const days = parseCalendar(await res.text());
  // fail loudly instead of publishing an empty city if GitHub changes its markup
  if (days.length < 300) throw new Error(`only found ${days.length} calendar cells; GitHub markup may have changed`);
  return days;
}

/** Reads the running count out of the komarev badge. Returns null on any problem so the line is simply skipped. */
export async function fetchVisitors(user) {
  try {
    const res = await fetch(`https://komarev.com/ghpvc/?username=${user}&style=flat-square&label=views`, {
      headers: { "User-Agent": "profile-readme-build/1.0" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const nums = [...(await res.text()).matchAll(/>\s*([\d,]+)\s*</g)].map((m) => m[1]);
    return nums.length ? nums[nums.length - 1] : null;
  } catch {
    return null;
  }
}
