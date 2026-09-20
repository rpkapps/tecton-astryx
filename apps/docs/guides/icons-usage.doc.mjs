/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'icons-usage',
  title: 'Using icons',
  description:
    'The two ways a glyph reaches a component, the two cuts and four sizes, when an icon needs a label, and what to do when the set has no shape for you.',
  category: 'Guides',
  sections: [
    {
      title: 'Two ways in',
      content: [
        {
          type: 'prose',
          text: 'A component asks the **theme** for a glyph by the role it plays — the chevron on a select, the tick on a checkbox, the cross on a dismiss — and Tecton’s registry answers with its own artwork. You never write those; they arrive with the theme.',
        },
        {
          type: 'prose',
          text: 'For a glyph you choose yourself, import the component from `@tecton/react/icons` and hand it to whatever prop takes an icon. Every one of the 131 glyphs is an ordinary SVG component that paints in `currentColor`.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {AddIcon, DrillBitIcon, SearchIcon} from '@tecton/react/icons';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {TextInput} from '@tecton/react/TextInput';

<Button label="Add horizon" icon={<Icon icon={AddIcon} />} />
<TextInput label="Search" value={query} onChange={setQuery} startIcon={SearchIcon} />
<Icon icon={DrillBitIcon} size="md" />`,
        },
        {
          type: 'prose',
          text: '`Icon` also takes a semantic **name** — `<Icon icon="search" />` — which resolves through the active theme, so the same markup draws Tecton’s glyph under Tecton and something else under another theme. Prefer the component when you mean a particular picture, and the name when you mean a particular role. Browse all 131 under [Icons](/docs/foundations/icons).',
        },
      ],
    },
    {
      title: 'Cuts and sizes',
      content: [
        {
          type: 'prose',
          text: 'Both cuts come from the same artwork. `outline` is the default; `filled` reads louder and is what a selected or active state usually takes. The cut is a prop on the glyph itself, because it is a property of the drawing rather than of the frame around it.',
        },
        {
          type: 'code',
          language: 'tsx',
          code: `import {CheckCircleIcon} from '@tecton/react/icons';

<CheckCircleIcon variant="filled" width={24} height={24} aria-hidden="true" />`,
        },
        {
          type: 'prose',
          text: '`Icon` sizes in four steps — `xsm` (12px), `sm` (16px), `md` (20px, the default) and `lg` (24px) — and its `color` takes a role rather than a value. Glyphs paint in `currentColor`, so an icon handed to a button or a piece of text takes that element’s colour for free.',
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
<Button label="Delete horizon" icon={<Icon icon={DeleteIcon} />} />

{/* Meaningful: nothing else says what this cell is. */}
<Icon icon={WarningIcon} size="sm" label="Needs review" />`,
        },
        {
          type: 'prose',
          text: 'For a control that is *only* an icon, use `IconButton`, which requires a `label` and uses it as the accessible name — or `Button` with `isIconOnly`, which does the same.',
        },
      ],
    },
    {
      title: 'When the set has no shape for you',
      content: [
        {
          type: 'list',
          items: [
            'Look again under a domain name: about a quarter of the set is subsurface shapes — `DrillBitIcon`, `FaultIcon`, `HorizonIcon`, `StrataIcon`, `FacilityIcon` — that exist nowhere else.',
            'Use a near neighbour rather than importing an icon from another set: a foreign glyph reads as a foreign object at 16px.',
            '`Icon` will render any SVG component you hand it, so a one-off illustration is possible — but a one-off that recurs is a glyph the set is missing.',
            'If the shape genuinely is not there, ask for it. The set is generated from the design delivery, so a new glyph arrives as a named, typed member like every other.',
          ],
        },
      ],
    },
  ],
};
