/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'principles',
  title: 'Principles',
  description:
    'What Tecton is for, and the four decisions that everything else in the system follows from.',
  category: 'Guides',
  sections: [
    {
      title: 'The domain sets the rules',
      content: [
        {
          type: 'prose',
          text: 'Tecton is the design system for dense subsurface and well-engineering software: facies models, horizons, casing schematics, cost-versus-risk comparisons, project economics. Screens are read for hours at a time, in rooms that are often dark, by people who are looking for a number. Every decision below comes from that, and a component that fights it is the component that is wrong.',
        },
      ],
    },
    {
      title: 'Dark first',
      content: [
        {
          type: 'prose',
          text: 'Tecton was designed dark. The canvas is a warm near-black, the chrome is neutral mauve and graphite, and colour is spent almost entirely on data — teal for well geometry, salmon for risk, amber for a moderate verdict, green for a good one. Light mode exists and is supported, but every light value is **derived** from its dark counterpart rather than designed beside it: same colour family, same step on the ramp, the opposite surface.',
        },
        {
          type: 'list',
          items: [
            'Default to `mode="dark"`. It is what the design is, and it is `TectonProvider`\'s default.',
            'Treat light mode as a supported translation, not as a second first-class theme.',
            'Never hard-code a hex value: a literal colour is the one thing that cannot follow the mode.',
          ],
        },
      ],
    },
    {
      title: 'Elevation runs down',
      content: [
        {
          type: 'prose',
          text: 'The usual convention is inverted. The closer a surface is to the top of the stack, the **darker** it is: a panel is darker than the page it sits on, a menu is darker than the page, and the frontmost panel in a stack is pure black. Content **inside** a panel then steps back up in lightness — insets, fields and buttons are all lighter than the panel that holds them, and a table header is the lightest surface of all.',
        },
        {
          type: 'table',
          caption:
            'The layering, as measured across the design pattern screens.',
          columns: ['Layer', 'Relative lightness'],
          rows: [
            ['Page canvas', 'the warm near-black everything sits on'],
            [
              'Panel surface',
              'darker than the page; a 1px rule, never a shadow',
            ],
            ['Inset media or chart box', 'lighter again — back up to the page'],
            ['Fields and buttons inside the panel', 'lighter than the inset'],
            ['Table header', 'the lightest surface in the system'],
          ],
        },
        {
          type: 'prose',
          text: 'Depth is communicated by contrast and darkness, not by shadow: Tecton is flat. `Panel` and `Card` draw no shadow at all, and the elevation tokens exist for the rare genuinely floating surface. See [Elevation](/foundations/elevation).',
        },
      ],
    },
    {
      title: 'Numbers are monospace',
      content: [
        {
          type: 'prose',
          text: 'The strongest convention in the system: labels, titles and prose are set in Figtree, and **every measured value is set in IBM Plex Mono with tabular figures** — depths, costs, percentages, identifiers, and the one-word verdicts that stand for a measurement ("Moderate", "High", "Good"). Units are always smaller and dimmer than the number they follow, and semantic colour is applied to the number, not to the surface behind it.',
        },
        {
          type: 'code',
          language: 'tsx',
          caption: 'A metric row — the dominant data pattern in the system.',
          code: `<HStack justify="between" align="center">
  <Text variant="small" color="secondary">
    Top Depth (TVDSS)
  </Text>
  <Text variant="mediumData" hasTabularNumbers>
    2,525 m
  </Text>
</HStack>`,
        },
      ],
    },
    {
      title: 'The panel is the unit of composition',
      content: [
        {
          type: 'prose',
          text: 'Screens are built out of panels, and a panel has a settled anatomy. `Panel` implements it: a header row carrying an optional leading glyph, a title, optional actions and an optional close, then a 1px divider, then the content — 16px padding, 8px corners, a 1px subtle rule and no shadow.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'A **panel header** is a title plus right-aligned actions, always followed by a divider.',
            'A **section header** inside a panel is a bold title with a right-aligned control or verdict, preceded by a divider.',
            'A **labelled field** is a small muted label above a full-width control; two may be paired in one row.',
            'A **metric row** is a muted label on the left and a monospace value on the right, with a 1px divider between rows.',
            "A panel's committing action is a full-width primary button pinned at the foot.",
          ],
        },
        {
          type: 'prose',
          text: 'Composing those five shapes out of `Panel`, `Stack`, `Divider`, `Text` and the form controls will produce something that looks like Tecton without any custom CSS at all.',
        },
      ],
    },
    {
      title: 'One package, one stylesheet, one provider',
      content: [
        {
          type: 'prose',
          text: 'The last principle is about the package rather than the pixels. A consumer installs one dependency, imports one stylesheet and mounts one provider; everything else is components and tokens. Tecton ships compiled, so no application inherits its build tooling, and nothing in the public API names the library Tecton is built on — what is underneath is an implementation detail that is allowed to change.',
        },
      ],
    },
  ],
};
