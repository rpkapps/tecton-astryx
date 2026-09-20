/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'principles',
  title: 'Principles',
  description:
    'What Tecton is for, and the five decisions that everything else in the system follows from.',
  category: 'Guides',
  sections: [
    {
      title: 'The domain sets the rules',
      content: [
        {
          type: 'prose',
          text: 'Tecton is the design system for dense subsurface and well-engineering software: facies models, horizons, casing schematics, cost-versus-risk comparisons, project economics. Screens are read for hours at a time, in rooms that are often dark, by people who are looking for a number. Every decision below comes from that.',
        },
      ],
    },
    {
      title: 'Tecton is a theme, not a component library',
      content: [
        {
          type: 'prose',
          text: 'The package publishes a complete React component system as it is — every name, every prop, every type — and applies a theme to it. Nothing is renamed, nothing is wrapped and no API is invented. A `Button` is that system’s `Button`, documented [on its own page](/docs/components/Button), and Tecton decides what it looks like.',
        },
        {
          type: 'list',
          items: [
            'Look a component up in its own documentation and use it as documented.',
            'Where Tecton wants a variant the system does not ship, it declares one through the theme — `variant="outlined"` on a button, `status="neutral"` on a banner — which is an extra value for a prop that already exists, not a new component.',
            'Anything Tecton cannot express through the theme is a gap in the theme, not a reason to write a component of our own.',
          ],
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
            'Default to `mode="dark"`. It is what the design is, and it is `TectonProvider`’s default.',
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
          text: 'The usual convention is inverted. The closer a surface is to the top of the stack, the **darker** it is: a card is darker than the page it sits on, a menu is darker than the page, and the frontmost surface in a stack is nearly black. Content **inside** a card then steps back up in lightness — insets, fields and buttons are all lighter than the card that holds them, and a table header is the lightest surface of all.',
        },
        {
          type: 'table',
          caption:
            'The layering, as measured across the design pattern screens.',
          columns: ['Layer', 'Relative lightness'],
          rows: [
            ['Page canvas', 'the warm near-black everything sits on'],
            [
              'Card surface',
              'darker than the page; a 1px rule, never a shadow',
            ],
            ['Inset media or chart box', 'lighter again — back up to the page'],
            ['Fields and buttons inside the card', 'lighter than the inset'],
            ['Table header', 'the lightest surface in the system'],
          ],
        },
        {
          type: 'prose',
          text: 'Depth is communicated by contrast and darkness, not by shadow: Tecton is flat. `Card` and `Section` draw no shadow by default, and the elevation tokens exist for the rare genuinely floating surface. See [Elevation](/docs/foundations/elevation).',
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
          code: `import {HStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

<HStack hAlign="between" vAlign="center">
  <Text type="supporting" color="secondary">
    Top Depth (TVDSS)
  </Text>
  <Text type="mediumData" hasTabularNumbers>
    2,525 m
  </Text>
</HStack>;`,
        },
        {
          type: 'prose',
          text: 'The eight data and emphasis text types — `mediumStrong`, `smallStrong`, `tiny`, `largeData`, `mediumData`, `smallData`, `actionMedium`, `actionSmall` — are Tecton’s, declared through the theme as extra values for `Text`’s existing `type` prop. See [Using typography](/docs/typography-usage).',
        },
      ],
    },
    {
      title: 'The card is the unit of composition',
      content: [
        {
          type: 'prose',
          text: 'Screens are built out of cards, and a card has a settled anatomy: a header row carrying a title and right-aligned actions, a divider, then the content. `Card`, `Section`, `Divider`, the `Stack` primitives and `Heading` compose it; there is no single component that draws the whole shape, because the shape varies and the parts do not.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'A **card header** is a title plus right-aligned actions, always followed by a divider.',
            'A **section header** inside a card is a bold title with a right-aligned control or verdict, preceded by a divider.',
            'A **labelled field** is a control with its own `label`; two may be paired in one row with `FormLayout`.',
            'A **metric row** is a muted label on the left and a monospace value on the right, with a 1px divider between rows.',
            'A card’s committing action is a full-width primary button pinned at the foot.',
          ],
        },
        {
          type: 'prose',
          text: 'Composing those five shapes out of `Card`, `Stack`, `Divider`, `Text` and the form controls produces something that looks like Tecton without any custom CSS at all.',
        },
      ],
    },
    {
      title: 'One package, one stylesheet, one provider',
      content: [
        {
          type: 'prose',
          text: 'The last principle is about the package rather than the pixels. A consumer installs one dependency, imports one stylesheet and mounts one provider; everything else is the component system and the tokens. Tecton ships compiled, so no application inherits its build tooling.',
        },
      ],
    },
  ],
};
