/*
 * Browser-side probes for the **state** audit.
 *
 * Injected verbatim into every audited page with `page.addInitScript`, beside
 * `probe.js`, so it may only use DOM APIs. Where `probe.js` answers "what does
 * this render measure", this one answers "what does this control *paint*, and
 * does the paint move when the control's state does".
 *
 * It installs four globals:
 *   __controls()          — one entry per stateful control under #stage
 *   __paint(index)        — the paint of that control's visual group, now
 *   __stateOf(index)      — the control's own state flags, now
 *   __focusControl(index) — put focus on it without touching the pointer
 */

(() => {
  const stageEl = () => document.getElementById('stage');

  // ------------------------------------------------------------- colour --

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
   * What is actually painted behind an element: every translucent wash on the
   * way up, composited in order onto the first opaque thing underneath. The
   * same reasoning as `probe.js`'s `backdrop`, and for the same reason — half
   * the state paints in this system are alpha overlays, and an alpha has to be
   * measured against what is under it rather than against a guess.
   *
   * A `background-image` is treated as opaque cover when it is a gradient,
   * because that is how the interaction overlays paint: a flat two-stop
   * gradient of the overlay colour over whatever the element's own fill is.
   */
  const backdrop = el => {
    const stack = [];
    let node = el.parentElement;
    while (node) {
      const cs = getComputedStyle(node);
      const image = cs.backgroundImage;
      if (image && image !== 'none') {
        const tint = parseColor(image);
        if (tint) stack.push(tint);
      }
      const colour = parseColor(cs.backgroundColor);
      if (colour && colour.a > 0.004) {
        stack.push(colour);
        if (colour.a >= 0.999) break;
      }
      node = node.parentElement;
    }
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

  /** The element's own painted surface — its fill over what is behind it. */
  const surfaceOf = el => {
    const cs = getComputedStyle(el);
    let base = backdrop(el);
    const own = parseColor(cs.backgroundColor);
    if (own && own.a > 0.004) base = composite(own, base);
    const image = cs.backgroundImage;
    if (image && image !== 'none') {
      const tint = parseColor(image);
      if (tint) base = composite(tint, base);
    }
    return base;
  };

  // ------------------------------------------------------------ controls --

  /**
   * Everything in the system whose paint is supposed to move when its state
   * does. Deliberately written as roles and attributes rather than as
   * `astryx-*` classes: a control that stops painting its selected state is a
   * finding whichever component drew it, and the aria surface is the one both
   * renders share.
   */
  const CONTROL_SELECTORS = [
    ['pressed', '[aria-pressed]'],
    ['switch', '[role="switch"]'],
    ['checkbox', 'input[type="checkbox"]:not([role="switch"])'],
    ['radio', 'input[type="radio"]'],
    ['tab', '[role="tab"]'],
    ['segmented', '[role="radio"]'],
    ['option', '[aria-selected]'],
    ['expanded', '[aria-expanded]'],
    ['menucheck', '[role="menuitemcheckbox"],[role="menuitemradio"]'],
    ['treeitem', '[role="treeitem"]'],
    ['current', '[aria-current]'],
    ['slider', '[role="slider"]'],
    ['card', '.astryx-selectable-card,.astryx-clickable-card'],
    ['link', 'a[href]'],
  ];

  /**
   * The element whose paint answers for the control.
   *
   * Half of these controls are a visually hidden `<input>` with the artwork
   * beside it — a checkbox's indicator, a switch's track — so asking the
   * focusable element what it paints answers "nothing, it is invisible". The
   * paint root is the nearest ancestor that actually occupies space, which is
   * the box that contains both the input and whatever draws for it.
   */
  const paintRootOf = el => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const hidden =
      parseFloat(cs.opacity) < 0.05 ||
      cs.visibility === 'hidden' ||
      rect.width < 4 ||
      rect.height < 4;
    if (!hidden) return el;
    let node = el.parentElement;
    const stage = stageEl();
    while (node && node !== stage && node !== document.body) {
      const r = node.getBoundingClientRect();
      const ncs = getComputedStyle(node);
      if (r.width >= 4 && r.height >= 4 && parseFloat(ncs.opacity) >= 0.05) {
        return node;
      }
      node = node.parentElement;
    }
    return el;
  };

  const pathOf = el => {
    const stage = stageEl();
    const parts = [];
    let node = el;
    while (node && node !== stage) {
      const parent = node.parentElement;
      if (!parent) break;
      const index = Array.prototype.indexOf.call(parent.children, node);
      parts.unshift(`${index}:${node.tagName.toLowerCase()}`);
      node = parent;
    }
    return parts.join('/');
  };

  const astryxClasses = el =>
    (el.getAttribute('class') || '')
      .split(/\s+/)
      .filter(c => c.startsWith('astryx-'))
      .join(' ');

  const labelOf = el =>
    (
      el.getAttribute('aria-label') ||
      (el.textContent || '').trim().slice(0, 40)
    ).replace(/\s+/g, ' ');

  /** How many controls of one kind are worth looking at in one example. */
  const PER_KIND = 3;
  /** And how many in total, so a 300-link page does not become the audit. */
  const PER_EXAMPLE = 8;

  let controls = [];

  window.__controls = () => {
    const stage = stageEl();
    controls = [];
    if (!stage) return [];
    const seen = new Set();
    for (const [kind, selector] of CONTROL_SELECTORS) {
      let taken = 0;
      for (const el of stage.querySelectorAll(selector)) {
        if (taken >= PER_KIND) break;
        if (seen.has(el)) continue;
        const rect = el.getBoundingClientRect();
        // Off-screen and zero-box controls have no paint to compare. A hidden
        // input is the exception: its artwork is the sibling beside it.
        const isHiddenInput = el.tagName.toLowerCase() === 'input';
        if (!isHiddenInput && (rect.width < 2 || rect.height < 2)) continue;
        if (el.closest('[hidden]')) continue;
        const root = paintRootOf(el);
        const rootRect = root.getBoundingClientRect();
        if (rootRect.width < 2 || rootRect.height < 2) continue;
        // Only the part of the viewport the driver can actually point at.
        if (rootRect.top < 0 || rootRect.top > window.innerHeight - 8) continue;
        if (rootRect.left < 0 || rootRect.left > window.innerWidth - 8)
          continue;
        seen.add(el);
        controls.push({el, root, kind});
        taken += 1;
        if (controls.length >= PER_EXAMPLE) break;
      }
      if (controls.length >= PER_EXAMPLE) break;
    }
    return controls.map((entry, index) => {
      const rect = entry.root.getBoundingClientRect();
      return {
        index,
        kind: entry.kind,
        path: pathOf(entry.el),
        rootPath: pathOf(entry.root),
        astryx: astryxClasses(entry.root) || astryxClasses(entry.el),
        tag: entry.el.tagName.toLowerCase(),
        label: labelOf(entry.el),
        // Viewport coordinates the driver points the mouse at.
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  };

  /** The state flags that say whether a click actually moved the control. */
  window.__stateOf = index => {
    const entry = controls[index];
    if (!entry) return null;
    const el = entry.el;
    return [
      el.getAttribute('aria-pressed'),
      el.getAttribute('aria-selected'),
      el.getAttribute('aria-expanded'),
      el.getAttribute('aria-checked'),
      el.getAttribute('aria-current'),
      el.getAttribute('data-selected'),
      el.getAttribute('data-checked'),
      el.getAttribute('data-is-pressed'),
      'checked' in el ? String(el.checked) : '',
      'value' in el ? String(el.value).slice(0, 20) : '',
    ].join('|');
  };

  window.__focusControl = index => {
    const entry = controls[index];
    if (!entry) return false;
    const target = entry.el.matches(
      'a[href],button,input,select,textarea,[tabindex]',
    )
      ? entry.el
      : entry.root.querySelector(
          'a[href],button,input,select,textarea,[tabindex]',
        ) || entry.el;
    try {
      target.focus({preventScroll: true});
    } catch {
      return false;
    }
    return document.activeElement === target;
  };

  /** How deep into a control the paint is worth following. */
  const MAX_NODES = 24;

  /**
   * Text big enough to be held to the large-text bar rather than the body one.
   * WCAG: 18pt (24px), or 14pt (18.66px) at 700+.
   */
  const isLargeText = cs => {
    const size = parseFloat(cs.fontSize) || 0;
    const weight = parseFloat(cs.fontWeight) || 400;
    return size >= 24 || (size >= 18.66 && weight >= 700);
  };

  const ownText = el => {
    let text = '';
    for (const node of el.childNodes) {
      if (node.nodeType === 3) text += node.nodeValue;
    }
    return text.trim();
  };

  /**
   * The paint of one control, as a list of rows — the control's own box plus
   * every visual descendant. Colour only: nothing here measures geometry,
   * which the resting audit already does.
   */
  window.__paint = index => {
    const entry = controls[index];
    if (!entry) return null;
    const root = entry.root;
    const rows = [];
    const inks = [];

    const walk = (el, path, depth) => {
      if (rows.length >= MAX_NODES) return;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (cs.display === 'none') return;
      rows.push({
        path,
        tag: el.tagName.toLowerCase(),
        astryx: astryxClasses(el),
        bg: cs.backgroundColor,
        bgImage: cs.backgroundImage === 'none' ? '' : cs.backgroundImage,
        color: cs.color,
        border: [
          cs.borderTopColor,
          cs.borderRightColor,
          cs.borderBottomColor,
          cs.borderLeftColor,
          cs.borderTopWidth,
          cs.borderBottomWidth,
        ].join(' '),
        shadow: cs.boxShadow === 'none' ? '' : cs.boxShadow,
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} ${cs.outlineOffset}`,
        opacity: cs.opacity,
        transform: cs.transform,
        weight: cs.fontWeight,
        decoration: `${cs.textDecorationLine} ${cs.textDecorationColor} ${cs.textDecorationStyle}`,
      });

      // Contrast is only meaningful where there is ink on a surface. A
      // disabled control is exempt: the platform's disabled affordance is
      // precisely "greyed out", and WCAG 1.4.3 exempts it.
      const disabled =
        el.closest('[disabled],[aria-disabled="true"],[data-disabled]') != null;
      const invisible =
        parseFloat(cs.opacity) < 0.5 ||
        cs.visibility === 'hidden' ||
        rect.width < 2 ||
        rect.height < 2;
      if (!disabled && !invisible) {
        const text = ownText(el);
        const isGlyph = el.tagName.toLowerCase() === 'svg';
        if (text.length > 0 || isGlyph) {
          const ink = parseColor(cs.color);
          if (ink && ink.a > 0.05) {
            const bg = isGlyph ? backdrop(el) : surfaceOf(el);
            inks.push({
              path,
              kind: isGlyph ? 'icon' : 'text',
              sample: isGlyph ? '(icon)' : text.slice(0, 24),
              colour: cs.color,
              on: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
              need: isGlyph ? 3 : isLargeText(cs) ? 3 : 4.5,
              ratio: Math.round(contrast(composite(ink, bg), bg) * 100) / 100,
            });
          }
        }
      }

      if (el.tagName.toLowerCase() === 'svg') return;
      if (depth >= 6) return;
      let child = 0;
      for (const node of el.children) {
        walk(node, `${path}/${child}:${node.tagName.toLowerCase()}`, depth + 1);
        child += 1;
      }
    };

    walk(root, '', 0);
    return {rows, inks};
  };
})();
