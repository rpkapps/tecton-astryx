/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'micro-frontends',
  title: 'Micro-frontends',
  description:
    'Putting Tecton on a page that has more than one copy of it: the host owns the tokens, every container is nested, and four things are not supported.',
  category: 'Guides',
  sections: [
    {
      title: 'The shape that works',
      content: [
        {
          type: 'prose',
          text: 'One theme layer on the page, one owner of the document root, and one component stylesheet per container. Everything else in this topic follows from those three sentences.',
        },
        {
          type: 'code',
          language: 'html',
          caption:
            'The shell loads exactly one tokens.css: the newest Tecton it knows about.',
          code: `<link rel="stylesheet" href="/assets/tecton-0.4.0/tokens.css" />

<!-- Each container ships the component CSS that matches its own code. -->
<link rel="stylesheet" href="/containers/orders/tecton-components.css" />
<link rel="stylesheet" href="/containers/billing/tecton-components.css" />`,
        },
        {
          type: 'code',
          language: 'tsx',
          caption: 'The shell, before any container loads.',
          code: `import {configureTectonRoot} from '@tecton/react';

configureTectonRoot({mode: 'dark'});`,
        },
        {
          type: 'code',
          language: 'tsx',
          caption: 'Every container.',
          code: `<TectonProvider mode="dark" scope="nested">
  <App />
</TectonProvider>`,
        },
      ],
    },
    {
      title: 'Why it works',
      content: [
        {
          type: 'list',
          items: [
            '**Tokens stop being contested.** Two complete bundles each put their own token values in the same theme layer under the same scope, so source order decides the values for every container on the page. With one `tokens.css` there is nothing to contest: every container renders in the host’s values, on purpose.',
            '**Component styles stay version-correct.** The components’ own CSS is StyleX, and an atomic class name is a hash of its declaration, so two versions’ component rules coexist and each element carries only its own. A container’s `components.css` matches the code in its bundle.',
            '**The root has an owner.** `configureTectonRoot()` claims the document root before any container mounts, so the page canvas, the scrollbars and the native controls follow the shell, and no container can change them or take them away by unmounting.',
          ],
        },
      ],
    },
    {
      title: 'The entry points',
      content: [
        {
          type: 'table',
          columns: ['Import', 'Contains', 'Who loads it'],
          rows: [
            [
              '`@tecton/react/styles.css`',
              'everything — reset, components, theme',
              'single-app pages',
            ],
            [
              '`@tecton/react/styles-no-reset.css`',
              'everything but the global reset',
              'a host that owns its own reset',
            ],
            [
              '`@tecton/react/tokens.css`',
              'the theme layer only',
              'the host shell, **once**',
            ],
            [
              '`@tecton/react/components.css`',
              'reset, foundation and component CSS, no theme',
              'each container',
            ],
            [
              '`@tecton/react/components-no-reset.css`',
              'the same without the reset',
              'each container, when the host owns the reset',
            ],
          ],
        },
        {
          type: 'prose',
          text: 'Every one of them opens by declaring the cascade layer order. That line, not the order the sheets arrive in, is what fixes the order: the first statement a page sees registers the names and later ones are no-ops. Mixing entry points and versions therefore still gives one correct layer order.',
        },
      ],
    },
    {
      title: 'One cascade layer, one contract',
      content: [
        {
          type: 'prose',
          text: 'Everything Tecton ships — the palette, the type scale, the radii **and the per-component decisions** — is one cascade layer under one theme attribute. Tecton used to keep its component overrides in a second layer of its own, where a hashed class name kept each version apart. It does not any more.',
        },
        {
          type: 'prose',
          text: 'So a per-component decision is now a **cross-version contract in exactly the way a token value is**: two versions on one page resolve it by source order, for every container. The recommended shape is what settles it — one `tokens.css` from the host, `components.css` per container — and it is unchanged.',
        },
      ],
    },
    {
      title: 'Toasts',
      content: [
        {
          type: 'prose',
          text: '`useToast` is the component system’s own hook and a toast body is a `ReactNode`. An element built by one copy of React cannot be rendered by another’s, so there is no bus routing toast payloads between copies of the package and there is no longer one shared viewport: **each copy of `@tecton/react` on the page shows its own toasts in its own viewport.**',
        },
        {
          type: 'prose',
          text: 'On the recommended shape — every container nested — that means a container’s toasts appear where that container puts them. If a page needs one place for all of them, raise them from the shell.',
        },
      ],
    },
    {
      title: 'What the host shell must do',
      content: [
        {
          type: 'list',
          items: [
            'Load exactly one stylesheet per layer role: one `tokens.css` for the page, one `components.css` per container.',
            'Call `configureTectonRoot({mode})` before any container loads. It returns a release function; a shell that lives as long as the page never calls it.',
            'Make every container pass `scope="nested"`. A nested provider still themes its own tree in its own mode, and still keeps the root attributes alive while it is mounted, but it does not try to decide the page.',
            'Decide the colour mode once. There is one document; a container cannot have different browser chrome from its host.',
            'Own your reset, or accept the one the package ships. The reset-bearing entry points restyle host-owned headings and prose; the `-no-reset` ones do not.',
            'Know that a container themes your prose. The theme’s prose styles are scoped to the theme attribute, which the root provider puts on the document element, so host markup between it and the containers is inside that scope. The way to close it is to render host content inside an element carrying a different theme attribute value.',
          ],
        },
      ],
    },
    {
      title: 'If you cannot split the stylesheet',
      content: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Load exactly one complete Tecton stylesheet if you possibly can, and make it the newest. Two complete bundles mean the last-loaded one’s tokens win for every container on the page.',
            'Otherwise load them in a deterministic order you control from the shell — a fixed list of link tags, not "whichever bundle initialises first".',
            'Know the cost: roughly 190 kB of extra CSS per concurrent version, about half of it byte-identical to what is already there. Bound the number of concurrent versions by release policy; it is cheaper than any technical mitigation.',
          ],
        },
      ],
    },
    {
      title: 'What is not supported',
      content: [
        {
          type: 'list',
          items: [
            '**Cross-container layer nesting** — rendering one container’s dialog, popover or tooltip into another container’s DOM subtree. Escape now dismisses the layer that is actually on top, so the orphaning half of this is fixed; the other half cannot be, because it is a second React root rendering into a node the first can detach at any moment. A container’s layers belong to that container’s tree.',
            '**Mixed major versions of the library Tecton is built on.** Their base layers and component selectors stop agreeing. Keep concurrent Tecton versions inside one of them; the release policy, not the code, is what enforces this.',
            '**Reaching past Tecton to the library underneath.** A container that imports the upstream `Dialog`, `BottomSheet` or `Lightbox` directly is outside every coordination mechanism here — Tecton can only coordinate document state it is in the call path for.',
            '**A non-Tecton consumer of the same underlying library on the page.** It will keep fighting over the document attributes; nothing here reaches it.',
          ],
        },
      ],
    },
    {
      title: 'What Tecton does for you',
      content: [
        {
          type: 'list',
          items: [
            '`TectonProvider` takes `scope`: `root` (the default) or `nested`. Behaviour for a single provider on a page is unchanged.',
            '`configureTectonRoot({mode, themeName})` claims the document root from a host shell and returns a release function. It is a plain function, so a shell that is not a React application can call it.',
            'Root ownership is ref-counted and shared by every copy of Tecton on the page: the first owning claim decides the attributes, a later one that disagrees is ignored with a development warning, non-owning claims keep the attributes alive, and the last release removes them. Anything that changes them behind Tecton’s back is put back.',
            'One scroll lock and one layer stack per document, so a modal in one container cannot freeze the page for another and one Escape dismisses exactly the layer on top.',
            'The theme’s token coverage is pinned and checked on every build, so a version cannot win a token another version does not define.',
          ],
        },
        {
          type: 'prose',
          text: 'Two things it deliberately does not do: it does not stop the underlying provider writing the root attributes in the first place — there is a one-microtask window, before paint, in which a synchronous reader sees the wrong value — and it does not reach a non-Tecton consumer of the same library on the page.',
        },
      ],
    },
  ],
};
