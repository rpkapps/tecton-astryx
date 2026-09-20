/**
 * A small WCAG contrast implementation for the theme tests.
 *
 * The component library keeps its own contrast helpers internal (they are not
 * on any public subpath), so the tests carry this one. It is the WCAG 2.x
 * definition: sRGB relative luminance, `(L1 + 0.05) / (L2 + 0.05)`, with an
 * alpha-carrying foreground composited over the backdrop first.
 */

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parse `#rgb`, `#rrggbb` or `#rrggbbaa`. */
export function parseHex(color: string): Rgba {
  const hex = color.trim().replace('#', '');
  const expand = (value: string) => parseInt(value, 16) / 255;

  if (hex.length === 3) {
    return {
      r: expand(hex[0] + hex[0]),
      g: expand(hex[1] + hex[1]),
      b: expand(hex[2] + hex[2]),
      a: 1,
    };
  }
  if (hex.length === 6 || hex.length === 8) {
    return {
      r: expand(hex.slice(0, 2)),
      g: expand(hex.slice(2, 4)),
      b: expand(hex.slice(4, 6)),
      a: hex.length === 8 ? expand(hex.slice(6, 8)) : 1,
    };
  }
  throw new Error(`Not a hex colour: ${color}`);
}

const channel = (value: number) =>
  value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

/** WCAG relative luminance of an opaque colour. */
export function relativeLuminance({r, g, b}: Rgba): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Composite a translucent foreground over an opaque backdrop. */
export function compositeOver(foreground: Rgba, backdrop: Rgba): Rgba {
  const a = foreground.a;
  return {
    r: foreground.r * a + backdrop.r * (1 - a),
    g: foreground.g * a + backdrop.g * (1 - a),
    b: foreground.b * a + backdrop.b * (1 - a),
    a: 1,
  };
}

/**
 * The WCAG contrast ratio between two colours, 1…21.
 *
 * A translucent foreground is composited over the backdrop first, which is what
 * a browser draws and therefore what a reader sees.
 */
export function contrastRatio(foreground: string, backdrop: string): number {
  const back = parseHex(backdrop);
  const front = compositeOver(parseHex(foreground), back);
  const a = relativeLuminance(front);
  const b = relativeLuminance(back);
  const [high, low] = a > b ? [a, b] : [b, a];
  return (high + 0.05) / (low + 0.05);
}
