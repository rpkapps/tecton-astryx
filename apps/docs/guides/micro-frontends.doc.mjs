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
            "**Tokens stop being contested.** Two complete bundles each put their own token values in the same theme layer under the same scope, so source order decides the values for every container on the page. With one `tokens.css` there is nothing to contest: every container renders in the host's values, on purpose.",
            "**Component styles stay version-correct.** A component class name is a hash of its declarations, so two versions' component rules coexist and each element carries only its own. A container's `components.css` matches the code in its bundle.",
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
              'reset and components, no theme',
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
      title: 'What the host shell must do',
      content: [
        {
          type: 'list',
          items: [
            'Load exactly one stylesheet per layer role: one `tokens.css` for the page, one `components.css` per container.',
            'Call `configureTectonRoot({mode})` before any container loads. It returns a release function; a shell that lives as long as the page never calls it.',
            'Make every container pass `scope="nested"`. A nested provider still themes its own tree in its own mode, and still keeps the root attributes alive while it is mounted, but it does not try to decide the page.',
            'Decide the colour mode once. There is one document; a container cannot have different browser chrome from its host.',
            "Own your reset, or accept Tecton's. The reset-bearing entry points restyle host-owned headings and prose; the `-no-reset` ones do not.",
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
            "Load exactly one complete Tecton stylesheet if you possibly can, and make it the newest. Two complete bundles mean the last-loaded one's tokens win for every container on the page.",
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
            "**Cross-container layer nesting** — rendering one container's dialog, popover or tooltip into another container's DOM subtree. One Escape closes the outer layer and leaves the inner one orphaned. A container's layers belong to that container's tree.",
            '**Two containers holding layers open at once.** One Escape dismisses exactly one layer, and when layers from different containers are open at the same time, the one that closes is not necessarily the one on top.',
            '**Mixed major versions of the library Tecton is built on.** Their base layers and component selectors stop agreeing. Keep concurrent Tecton versions inside one of them; the release policy, not the code, is what enforces this.',
            '**Reaching past Tecton to the library underneath.** Tecton can only coordinate document state it is in the call path for.',
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
            "Root ownership is ref-counted and shared by every copy of Tecton on the page: the first owning claim decides the attributes, a later one that disagrees is ignored with a development warning, non-owning claims keep the attributes alive, and the last release removes them. Anything that changes them behind Tecton's back is put back.",
            "The theme's token coverage is pinned and checked on every build, so a version cannot win a token another version does not define.",
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
