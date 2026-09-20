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
      // An `svg`'s insides are artwork, not layout. Tecton's glyphs and the
      // reference theme's Lucide ones are different drawings — a different
      // number of paths, at different coordinates — and walking into them
      // compares one icon set with another rather than one theme with another.
      // The `svg` element itself is measured; what is inside it is not.
      if (el.tagName.toLowerCase() === 'svg') return;
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

  /**
   * What is actually painted behind an element.
   *
   * Not simply "the nearest ancestor with a background": several of the colours
   * in play are alpha washes — a hue tint on a Token, an overlay on a row — and
   * a wash has to be composited onto what is under *it*, not onto a guess. So
   * the ancestors are collected until one is opaque, then painted back down in
   * order.
   */
  const backdrop = el => {
    const stack = [];
    let node = el.parentElement;
    while (node) {
      const colour = parseColor(getComputedStyle(node).backgroundColor);
      if (colour && colour.a > 0.004) {
        stack.push(colour);
        if (colour.a >= 0.999) break;
      }
      node = node.parentElement;
    }
    // Nothing opaque underneath: the canvas is what shows through.
    let base = {r: 255, g: 255, b: 255, a: 1};
    const canvas = parseColor(
      getComputedStyle(document.documentElement).backgroundColor,
    );
    if (canvas && canvas.a >= 0.999) base = canvas;
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      base = composite(stack[i], base);
    }
    return base;
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
    // The elements that can become `document.activeElement`, plus the few
    // ancestors that might ring on their behalf. Reading a computed style
    // forces a style resolution, and doing it for every node of every example
    // was the slowest thing in the run.
    const all = new Set([stage]);
    for (const el of stage.querySelectorAll(FOCUSABLE)) {
      all.add(el);
      let node = el.parentElement;
      for (let up = 0; up < RING_ANCESTORS && node && node !== stage; up += 1) {
        all.add(node);
        node = node.parentElement;
      }
    }
    for (const el of all) {
      const cs = getComputedStyle(el);
      el.__restingShadow = cs.boxShadow;
      el.__restingBorder = cs.borderTopColor;
    }
    return all.size;
  };

  /**
   * How far up to look for the ring.
   *
   * A field's focusable element is a bare `<input>` with `outline: none`; the
   * ring is the wrapper's, drawn on `:focus-within` as a border colour and an
   * inset shadow. A checkbox's is painted on the indicator beside it. So "does
   * this stop show focus" cannot be answered by looking at the stop alone.
   *
   * And a focus indicator is not only an outline. A border that *changes
   * colour* on focus is the affordance for every field in the system, so it
   * counts — and it is what stops counting when a theme repaints the resting
   * border from a later cascade layer.
   */
  const RING_ANCESTORS = 4;

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
    let ringShadow = hasShadowRing ? shadow : '';
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
    // Still nothing: look up. A field rings itself on `:focus-within`, on the
    // wrapper, as a border colour plus an inset shadow — neither of which is on
    // the `<input>` that actually has focus.
    if (ringOwner == null && !hasShadowRing) {
      let node = el.parentElement;
      for (let up = 0; up < RING_ANCESTORS && node && node !== stage; up += 1) {
        const acs = getComputedStyle(node);
        const aw = parseFloat(acs.outlineWidth) || 0;
        if (aw > 0 && acs.outlineStyle !== 'none') {
          ringOwner = node;
          ringWidth = aw;
          ringStyle = acs.outlineStyle;
          ringOffset = parseFloat(acs.outlineOffset) || 0;
          ringColorValue = acs.outlineColor;
          break;
        }
        // A border focus turned a different colour is the field affordance.
        const aBorder = acs.borderTopColor;
        const restingBorder = node.__restingBorder;
        const borderWidth = parseFloat(acs.borderTopWidth) || 0;
        if (
          borderWidth > 0 &&
          restingBorder != null &&
          aBorder !== restingBorder
        ) {
          ringOwner = node;
          ringWidth = borderWidth;
          ringStyle = 'border';
          ringOffset = 0;
          ringColorValue = aBorder;
          break;
        }
        const aShadow =
          acs.boxShadow && acs.boxShadow !== 'none' ? acs.boxShadow : '';
        const aResting = node.__restingShadow;
        if (aShadow && aResting != null && aShadow !== aResting) {
          ringOwner = node;
          ringWidth = 0;
          ringStyle = 'none';
          ringOffset = 0;
          ringColorValue = '';
          ringShadow = aShadow;
          break;
        }
        node = node.parentElement;
      }
    }
    const drawn = ringOwner != null || hasShadowRing;
    const colour = parseColor(ringColorValue) || parseColor(ringShadow);
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
      ringOwner:
        ringOwner == null
          ? ''
          : astryxClasses(ringOwner) || ringOwner.tagName.toLowerCase(),
      ringOn:
        ringOwner === el
          ? 'self'
          : ringOwner == null
            ? hasShadowRing
              ? 'self'
              : 'none'
            : ringOwner.contains(el)
              ? 'ancestor'
              : 'descendant',
      outlineWidth: ringWidth,
      outlineStyle: ringStyle,
      outlineOffset: ringOffset,
      outlineColor: ringColorValue,
      backdrop: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      boxShadow: (ringShadow || shadow).slice(0, 200),
      hasRing: drawn,
      contrast: Math.round(ratio * 100) / 100,
      clipped,
      clipBy,
    };
  };
})();
