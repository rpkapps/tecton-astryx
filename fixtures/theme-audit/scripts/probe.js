/*
 * Browser-side probes. This file is injected verbatim into every audited page
 * with `page.addInitScript`, so it may only use DOM APIs.
 *
 * It installs three globals:
 *   __measure()        — one row per element under #stage: box, type, clipping
 *   __focusables()     — how many tab stops the stage holds
 *   __describeActive() — what ring, if any, the focused element is drawing
 */

(() => {
  const stageEl = () => document.getElementById('stage');

  /**
   * The nearest ancestor that would clip `el` — stopping at `#stage`, because
   * everything above it is harness chrome (`src/stage.css` caps the document
   * height so a 40 000px example cannot take the renderer down) and not part of
   * what either theme laid out.
   */
  const clipAncestor = (el, hiddenOnly) => {
    let node = el.parentElement;
    while (node && node !== document.body && node.id !== 'stage') {
      const cs = getComputedStyle(node);
      const clips = hiddenOnly
        ? ['hidden', 'clip'].includes(cs.overflowX) ||
          ['hidden', 'clip'].includes(cs.overflowY)
        : cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
      if (clips) return node;
      node = node.parentElement;
    }
    return null;
  };

  const astryxClasses = el =>
    (el.getAttribute('class') || '')
      .split(/\s+/)
      .filter(c => c.startsWith('astryx-'))
      .join(' ');

  /** How many line boxes a text-only element occupies. */
  const lineCount = el => {
    const hasElementChild = Array.from(el.childNodes).some(
      n => n.nodeType === 1,
    );
    if (hasElementChild) return null;
    if (!(el.textContent || '').trim()) return null;
    const range = document.createRange();
    range.selectNodeContents(el);
    const boxes = Array.from(range.getClientRects()).filter(
      r => r.width > 0 && r.height > 0,
    );
    if (boxes.length === 0) return null;
    return new Set(boxes.map(r => Math.round(r.top))).size;
  };

  window.__measure = () => {
    const stage = stageEl();
    if (!stage) return {error: 'no stage'};
    const origin = stage.getBoundingClientRect();
    const rows = [];

    const walk = (el, path) => {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const clip = clipAncestor(el, false);
      let overflows = false;
      if (clip && rect.width > 0 && rect.height > 0) {
        const cr = clip.getBoundingClientRect();
        const slack = 1;
        overflows =
          rect.right > cr.right + slack ||
          rect.bottom > cr.bottom + slack ||
          rect.left < cr.left - slack ||
          rect.top < cr.top - slack;
      }
      rows.push({
        path,
        tag: el.tagName.toLowerCase(),
        astryx: astryxClasses(el),
        role: el.getAttribute('role') || '',
        variant: el.getAttribute('data-variant') || '',
        elevation: el.getAttribute('data-elevation') || '',
        x: Math.round((rect.left - origin.left) * 100) / 100,
        y: Math.round((rect.top - origin.top) * 100) / 100,
        w: Math.round(rect.width * 100) / 100,
        h: Math.round(rect.height * 100) / 100,
        overflows,
        lines: lineCount(el),
        display: cs.display,
        // Recorded so the diff can tell a recolour (expected — Tecton is a
        // palette) from a *collapse*: two siblings that differ by `variant`
        // upstream and no longer differ at all here, which means a theme rule
        // has painted over the prop.
        bg: cs.backgroundColor,
        shadow: cs.boxShadow === 'none' ? '' : cs.boxShadow.slice(0, 80),
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        radius: cs.borderRadius,
        // Which corners are square. A connected control — a member of a button
        // group, a segmented item, a joined input — is recognisable by having
        // *some* square corners; a theme that rounds all four has flattened the
        // group into a row of separate pills.
        corners: [
          cs.borderTopLeftRadius,
          cs.borderTopRightRadius,
          cs.borderBottomRightRadius,
          cs.borderBottomLeftRadius,
        ]
          .map(v => (parseFloat(v) > 0.5 ? 'r' : '0'))
          .join(''),
        padding: [
          cs.paddingTop,
          cs.paddingRight,
          cs.paddingBottom,
          cs.paddingLeft,
        ].join(' '),
        border: [cs.borderTopWidth, cs.borderLeftWidth].join(' '),
      });
      let index = 0;
      for (const child of el.children) {
        walk(child, `${path}/${index}:${child.tagName.toLowerCase()}`);
        index += 1;
      }
    };

    let index = 0;
    for (const child of stage.children) {
      walk(child, `${index}:${child.tagName.toLowerCase()}`);
      index += 1;
    }
    return {
      rows,
      stage: {w: Math.round(origin.width), h: Math.round(origin.height)},
    };
  };

  // ---------------------------------------------------------------- focus --

  const parseColor = value => {
    const match = /rgba?\(([^)]+)\)/.exec(value || '');
    if (!match) return null;
    const parts = match[1]
      .split(/[,/\s]+/)
      .filter(Boolean)
      .map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts.length > 3 ? parts[3] : 1,
    };
  };

  const luminance = c => {
    const channel = v => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return (
      0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b)
    );
  };

  const composite = (fg, bg) =>
    fg.a >= 0.999
      ? fg
      : {
          r: fg.r * fg.a + bg.r * (1 - fg.a),
          g: fg.g * fg.a + bg.g * (1 - fg.a),
          b: fg.b * fg.a + bg.b * (1 - fg.a),
          a: 1,
        };

  const contrast = (a, b) => {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  /** The nearest painted background behind an element. */
  const backdrop = el => {
    let node = el.parentElement;
    while (node) {
      const colour = parseColor(getComputedStyle(node).backgroundColor);
      if (colour && colour.a > 0.05) {
        return composite(colour, {r: 255, g: 255, b: 255, a: 1});
      }
      node = node.parentElement;
    }
    return {r: 255, g: 255, b: 255, a: 1};
  };

  const FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
    'textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';

  window.__focusables = () => {
    const stage = stageEl();
    if (!stage) return 0;
    return Array.from(stage.querySelectorAll(FOCUSABLE)).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).length;
  };

  /**
   * Remember what every focusable element's box-shadow is *at rest*, before
   * anything is focused.
   *
   * Without this, any element that carries a shadow for another reason — a
   * lifted card, an elevated surface, a scroller with an edge fade — reads as
   * "draws a ring", and the ring's contrast gets measured against the shadow's
   * colour. A box-shadow is only a focus ring if focus is what put it there.
   */
  window.__snapshotResting = () => {
    const stage = stageEl();
    if (!stage) return 0;
    const all = [stage, ...stage.querySelectorAll('*')];
    for (const el of all) {
      el.__restingShadow = getComputedStyle(el).boxShadow;
    }
    return all.length;
  };

  window.__describeActive = () => {
    const el = document.activeElement;
    const stage = stageEl();
    if (!el || el === document.body || !stage || !stage.contains(el)) {
      return null;
    }
    const cs = getComputedStyle(el);
    const width = parseFloat(cs.outlineWidth) || 0;
    const style = cs.outlineStyle;
    const offset = parseFloat(cs.outlineOffset) || 0;
    const shadow = cs.boxShadow && cs.boxShadow !== 'none' ? cs.boxShadow : '';
    const hasOutline = width > 0 && style !== 'none';
    // Only a shadow that focus *added* counts (see `__snapshotResting`).
    const resting = el.__restingShadow;
    const hasShadowRing =
      shadow.length > 0 && resting != null && shadow !== resting;

    // The ring may also be drawn on a descendant — checkbox/radio indicators
    // get it painted on the indicator element by useIndicatorFocusRing.
    let ringOwner = hasOutline ? el : null;
    let ringWidth = width;
    let ringStyle = style;
    let ringOffset = offset;
    let ringColorValue = hasOutline ? cs.outlineColor : '';
    if (!hasOutline) {
      for (const descendant of el.parentElement
        ? el.parentElement.querySelectorAll('*')
        : []) {
        const dcs = getComputedStyle(descendant);
        const dw = parseFloat(dcs.outlineWidth) || 0;
        if (dw > 0 && dcs.outlineStyle !== 'none') {
          ringOwner = descendant;
          ringWidth = dw;
          ringStyle = dcs.outlineStyle;
          ringOffset = parseFloat(dcs.outlineOffset) || 0;
          ringColorValue = dcs.outlineColor;
          break;
        }
      }
    }
    const drawn = ringOwner != null || hasShadowRing;
    const colour = parseColor(ringColorValue) || parseColor(shadow);
    const target = ringOwner || el;
    const bg = backdrop(target);
    const ratio = colour ? contrast(composite(colour, bg), bg) : 0;

    const rect = target.getBoundingClientRect();
    let clipped = false;
    let clipBy = '';
    const clip = clipAncestor(target, true);
    if (clip && ringOwner) {
      const cr = clip.getBoundingClientRect();
      const reach = ringWidth + Math.max(ringOffset, 0);
      clipped =
        rect.left - reach < cr.left - 0.5 ||
        rect.top - reach < cr.top - 0.5 ||
        rect.right + reach > cr.right + 0.5 ||
        rect.bottom + reach > cr.bottom + 0.5;
      if (clipped) clipBy = astryxClasses(clip) || clip.tagName.toLowerCase();
    }

    return {
      tag: el.tagName.toLowerCase(),
      astryx: astryxClasses(el),
      label:
        el.getAttribute('aria-label') ||
        (el.textContent || '').trim().slice(0, 40),
      focusVisible: el.matches(':focus-visible'),
      ringOn: ringOwner === el ? 'self' : ringOwner ? 'descendant' : 'none',
      outlineWidth: ringWidth,
      outlineStyle: ringStyle,
      outlineOffset: ringOffset,
      outlineColor: ringColorValue,
      backdrop: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      boxShadow: shadow.slice(0, 200),
      hasRing: drawn,
      contrast: Math.round(ratio * 100) / 100,
      clipped,
      clipBy,
    };
  };
})();
