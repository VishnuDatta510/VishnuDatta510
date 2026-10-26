// Small shared helpers for the profile art generators.

// Deterministic PRNG (mulberry32) so the scene is identical on every build for the same data.
export function rng(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// GitHub blocks web fonts inside images, so everything uses system stacks.
export const SANS = '-apple-system,"Segoe UI",Helvetica,Arial,sans-serif';

// Wraps CSS that switches motion off for viewers who ask for reduced motion.
export const RM = (css) => `@media (prefers-reduced-motion:reduce){${css}}`;

export const fmt = (n) => n.toLocaleString("en-US");

export const SVG_NS = 'xmlns="http://www.w3.org/2000/svg"';
