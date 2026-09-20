/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'icons-usage',
  title: 'Using icons',
  description:
    'Naming a glyph, the two cuts and three sizes, when an icon needs a label, and what to do when the set has no shape for you.',
  category: 'Guides',
  sections: [
    {
      title: 'Icons are named, not imported',
      content: [
        {
          type: 'prose',
          text: 'Every Tecton prop that takes an icon takes a glyph **name**, so a button with an icon needs no second import and nothing in your code depends on where the artwork lives.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {Button, Icon, TextField} from '@tecton/react';

<Button label="Add horizon" icon="add" />
<TextField label="Search" value={query} onChange={setQuery} startIcon="search" />
<Icon name="drill-bit" size={20} />`,
        },
        {
          type: 'prose',
          text: 'The names are typed, so a glyph that does not exist is a build error rather than an empty square. Browse all 131 under [Icons](/foundations/icons).',
        },
      ],
    },
    {
      title: 'Cuts and sizes',
      content: [
        {
          type: 'prose',
          text: 'Both cuts come from the same artwork. `outline` is the default; `filled` reads louder and is what a selected or active state usually takes. Three sizes are drawn: 16px (the default, and what sits inside a control), 20px and 24px.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `<Icon name="check-circle" variant="filled" size={24} />`,
        },
        {
          type: 'prose',
          text: 'Glyphs paint in `currentColor`, so an icon takes the colour of the text beside it. Tecton draws icons one step dimmer than their label — that is `tecton.color.icon.*`, and the components already do it.',
        },
      ],
    },
    {
      title: 'Meaning and assistive technology',
      content: [
        {
          type: 'prose',
          text: 'An icon is decorative by default and hidden from assistive technology, which is right almost every time: the label beside it already says what it is. Pass `label` only when the glyph is the only thing carrying the meaning — a bare status mark in a table cell, say — and never when the control around it is already named.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `{/* Decorative: the button's own label names the action. */}
<Button label="Delete horizon" icon="delete" />

{/* Meaningful: nothing else says what this cell is. */}
<Icon name="warning" size={16} label="Needs review" />`,
        },
      ],
    },
    {
      title: 'When the set has no shape for you',
      content: [
        {
          type: 'list',
          items: [
            'Look again under a domain name: about a quarter of the set is subsurface shapes — `drill-bit`, `fault`, `horizon`, `strata`, `facility` — that exist nowhere else.',
            'Use a near neighbour rather than importing an icon from another set: a foreign glyph reads as a foreign object at 16px.',
            'If the shape genuinely is not there, ask for it. The set is generated from the design delivery, so a new glyph arrives as a named, typed member like every other.',
          ],
        },
      ],
    },
  ],
};
