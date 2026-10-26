// Link buttons, tech stack and visitor line. Each comes in a dark and a light variant so the README
// can pick one with <picture> and stay readable in either GitHub theme.
import { IC } from "./icons.mjs";
import { SANS, RM, SVG_NS } from "./util.mjs";

export const THEMES = {
  dark: { id: "d", fg: "#ffffff", sub: "#b9a9e8", label: "#8c7bc4", line: "#34296b", ico: "#cfc3f3", mono: "#e8e8f0" },
  light: { id: "l", fg: "#1f2328", sub: "#57606a", label: "#6e7781", line: "#d0d7de", ico: "#57606a", mono: "#24292f" },
};

// brands that are white in their own palette get a theme colour instead
const MONO_ICONS = new Set(["next", "express", "github", "openai", "socketio"]);
const icon = (k, x, y, s, p) =>
  `<path transform="translate(${x} ${y}) scale(${s / 24})" d="${IC[k].p}" fill="${MONO_ICONS.has(k) ? p.mono : IC[k].c}"/>`;

export const LINKS = [
  { key: "portfolio", label: "Portfolio", href: "https://vishnudatta.dev", icon: "web" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/vishnudattagb/", icon: "linkedin" },
  { key: "github", label: "GitHub", href: "https://github.com/VishnuDatta510", icon: "github" },
  { key: "leetcode", label: "LeetCode", href: "https://leetcode.com/u/Vishno-Way/", icon: "leetcode" },
];

// Rough label widths at 14.5px semi-bold, used to centre each icon + label pair inside its segment.
const LABEL_W = { Portfolio: 62, LinkedIn: 58, GitHub: 50, LeetCode: 62 };
const SEG_W = 190, SEG_H = 52;

/**
 * One segment of a four-part pill bar. Each segment is its own SVG because an <img> inside an <a> is the
 * only way to make an image clickable on GitHub; placed side by side at their natural width they join
 * into one continuous bar (rounded caps on the first and last, hairline dividers between).
 */
export function renderLink(link, i, p, count = LINKS.length) {
  const first = i === 0, last = i === count - 1, r = SEG_H / 2 - 0.5;
  const W = SEG_W;
  const outline = first
    ? `M${W} .5H${r + 0.5}A${r} ${r} 0 0 0 ${r + 0.5} ${SEG_H - 0.5}H${W}`
    : last
      ? `M0 .5H${W - r - 0.5}A${r} ${r} 0 0 1 ${W - r - 0.5} ${SEG_H - 0.5}H0`
      : `M0 .5H${W}M0 ${SEG_H - 0.5}H${W}`;
  const divider = first ? "" : `<path d="M.5 15V37" stroke="${p.line}"/>`;
  const unit = 18 + 9 + LABEL_W[link.label];
  const x0 = (W - unit) / 2;
  const glyph =
    link.icon === "web"
      ? `<g transform="translate(${x0 + 9} 26)" fill="none" stroke="${p.ico}" stroke-width="1.6" stroke-linecap="round"><circle r="8"/><ellipse rx="3.6" ry="8"/><path d="M-8 0h16"/></g>`
      : `<path transform="translate(${x0} 17) scale(.75)" d="${IC[link.icon].p}" fill="${p.ico}"/>`;
  return `<svg ${SVG_NS} width="${W}" height="${SEG_H}" viewBox="0 0 ${W} ${SEG_H}" role="img" aria-label="${link.label}">
<style>text{font-family:${SANS};font-size:14.5px;font-weight:600;fill:${p.fg}}
.o{opacity:0;animation:o .8s ease-out ${0.1 + i * 0.1}s forwards}
.i{opacity:0;animation:i .7s cubic-bezier(.2,.7,.2,1) ${0.3 + i * 0.12}s forwards}
@keyframes o{to{opacity:1}}@keyframes i{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
${RM(".o,.i{opacity:1;animation:none}")}</style>
<g class="o"><path d="${outline}" fill="none" stroke="${p.line}"/>${divider}</g>
<g class="i">${glyph}<text x="${x0 + 27}" y="31">${link.label}</text></g></svg>`;
}

const GROUPS = [
  ["LANGUAGES", ["python", "ts", "js", "java", "c", "html", "css"]],
  ["FRONTEND", ["react", "next", "tailwind", "vite", "ext"]],
  ["BACKEND", ["node", "express", "fastapi", "django", "socketio", "celery", "prisma"]],
  ["DATA &amp; CLOUD", ["postgres", "mongo", "redis", "aws", "firebase", "azure", "docker", "supabase"]],
  ["AI &amp; TOOLS", ["openai", "gemini", "ffmpeg", "git", "github", "postman"]],
];
const NAMES = {
  python: "Python", ts: "TypeScript", js: "JavaScript", java: "Java", c: "C", html: "HTML", css: "CSS",
  react: "React", next: "Next.js", tailwind: "Tailwind", vite: "Vite", ext: "Extensions",
  node: "Node.js", express: "Express", fastapi: "FastAPI", django: "Django", socketio: "Socket.IO",
  celery: "Celery", prisma: "Prisma", postgres: "PostgreSQL", mongo: "MongoDB", redis: "Redis", aws: "AWS",
  firebase: "Firebase", azure: "Azure", docker: "Docker", supabase: "Supabase", openai: "Whisper",
  gemini: "Gemini", ffmpeg: "FFmpeg", git: "Git", github: "GitHub", postman: "Postman",
};

export function renderTech(p) {
  let o = "", n = 0;
  GROUPS.forEach(([title, keys], r) => {
    const y = r * 66;
    if (r) o += `<path d="M0 ${y - 10}H760" stroke="${p.line}" stroke-opacity=".6"/>`;
    o += `<text class="l" x="0" y="${y + 22}">${title}</text>`;
    keys.forEach((k, i) => {
      const d = (0.15 + n++ * 0.04).toFixed(2);
      o += `<g transform="translate(${150 + i * 76} ${y})"><g class="t" style="animation-delay:${d}s"><title>${NAMES[k]}</title>${icon(k, 19, 2, 26, p)}<text class="n" x="32" y="46" text-anchor="middle">${NAMES[k]}</text></g></g>`;
    });
  });
  return `<svg ${SVG_NS} viewBox="0 0 760 326" role="img" aria-label="Tech stack: Python, TypeScript, React, Next.js, Node, FastAPI, Django, PostgreSQL, AWS, Docker and more">
<style>text{font-family:${SANS}}.l{font-size:10.5px;font-weight:600;letter-spacing:2.2px;fill:${p.label}}.n{font-size:10.5px;font-weight:500;fill:${p.sub}}
.t{opacity:0;animation:t .6s cubic-bezier(.2,.7,.2,1) forwards}
@keyframes t{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
${RM(".t{opacity:1;animation:none}")}</style>${o}</svg>`;
}

export function renderVisits(p, count) {
  return `<svg ${SVG_NS} viewBox="0 0 200 22" role="img" aria-label="${count} profile visitors"><style>text{font:500 12px ${SANS};fill:${p.sub};letter-spacing:.3px}.v{opacity:0;animation:v 1s ease-out 1s forwards}@keyframes v{to{opacity:1}}${RM(".v{opacity:1;animation:none}")}</style>
<g class="v"><path d="M52 11q6 -7 12 0q-6 7 -12 0z" fill="none" stroke="${p.sub}" stroke-width="1.3" stroke-linejoin="round"/><circle cx="58" cy="11" r="1.8" fill="${p.sub}"/><text x="74" y="15"><tspan fill="${p.fg}" font-weight="650">${count}</tspan> visitors</text></g></svg>`;
}
