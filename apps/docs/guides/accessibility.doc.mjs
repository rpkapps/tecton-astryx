/** @type {import('../src/types/docs.js').DocTopic} */
export const docs = {
  type: 'generic',
  name: 'accessibility',
  title: 'Accessibility',
  description:
    'What the components guarantee, what they need from you, and where a dark, dense interface takes particular care.',
  category: 'Guides',
  sections: [
    {
      title: 'What the components guarantee',
      content: [
        {
          type: 'list',
          items: [
            'Every interactive component is reachable and operable from the keyboard, with the roles and states its pattern requires.',
            'Every control has an accessible name that comes from a required prop — `label` on a button, a field, a tab — so a nameless control is a type error rather than a review finding.',
            'Focus is always visible: a 2px ring at a 2px offset, on every control in the system, in both colour modes.',
            'A group that behaves as one control — a radio list, a toggle-button group, a tab list — is one tab stop, with arrow keys moving inside it.',
            'Overlays manage focus: a dialog traps it, returns it to the trigger on close, and closes on Escape.',
            'Icons are hidden from assistive technology unless you give one a `label`.',
          ],
        },
        {
          type: 'prose',
          text: 'Each component page states the specifics for that component under **Accessibility**, as a table of the requirements it is measured against — the WCAG criterion, the ratio, and the states it applies in.',
        },
      ],
    },
    {
      title: 'What the components need from you',
      content: [
        {
          type: 'table',
          columns: ['You provide', 'Why'],
          rows: [
            [
              'Honest labels',
              'The label is the accessible name. "Generate facies model" is a name; "OK" is not.',
            ],
            [
              'Document structure',
              'Headings, landmarks and reading order are yours. `Heading`’s `accessibilityLevel` exists so the visual size never forces a wrong rank.',
            ],
            [
              'The right component for the job',
              'A button that navigates, or a link that submits, cannot be fixed by an ARIA attribute.',
            ],
            [
              'Text alternatives for data',
              'A chart, a schematic or a hatched bar needs a readable equivalent — a table, a caption, a summary line.',
            ],
            [
              'Status that is announced',
              'Use `Banner`, `ProgressBar`, `FieldStatus` or `useToast` rather than colouring text: a colour change is invisible to a screen reader.',
            ],
          ],
        },
      ],
    },
    {
      title: 'Colour, contrast and dark mode',
      content: [
        {
          type: 'prose',
          text: 'Tecton is dark first, and dark interfaces fail differently: thin type on a near-black canvas loses contrast faster than the same type on white. Two rules follow.',
        },
        {
          type: 'list',
          items: [
            'Keep body copy at `color="primary"` or `color="secondary"`. `disabled` and `placeholder` are for states, not for prose.',
            'Never let colour be the only signal. A verdict word, a status badge or an icon must carry the meaning as well as the hue — which is why Tecton prints "High" next to a red meter rather than colouring the meter alone.',
          ],
        },
        {
          type: 'prose',
          text: 'Light mode is derived from the dark palette rather than separately designed, so if you ship light mode as a default, re-check contrast on your own surfaces.',
        },
      ],
    },
    {
      title: 'Density and motion',
      content: [
        {
          type: 'list',
          items: [
            'Dense is a choice, not a default: `density="compact"` exists for tables and lists that genuinely need it, and a whole screen at compact is harder for everyone.',
            'Animations are short and functional, and they are drawn from the duration tokens rather than invented per component. Respect `prefers-reduced-motion` in anything you animate yourself.',
            'Tooltips are supplementary. Anything that only appears on hover is unavailable to touch and keyboard users unless it is also stated somewhere else.',
          ],
        },
      ],
    },
    {
      title: 'Internationalisation',
      content: [
        {
          type: 'prose',
          text: 'The components take their strings from a message catalogue, so a locale is a provider rather than a fork. `@tecton/react/i18n` publishes `InternationalizationProvider`, `useLocale`, `useTranslator` and `useCollator`; `@tecton/react/locales/*.json` are the catalogues. An override is keyed on the library’s own message ids, which look like `@astryx.dialog.close` — they are ids, not prose, and they have to be written exactly.',
        },
      ],
    },
    {
      title: 'Checking your own screens',
      content: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Tab through the screen. Every stop should be visible, in a sensible order, and nothing should trap you.',
            'Operate it without a pointer: open the menu, pick a tab, set the slider, dismiss the dialog.',
            'Read the outline. Headings alone should describe the page.',
            'Turn the colour mode over and look again.',
            'Zoom to 200%. Cards should reflow rather than clip.',
          ],
        },
      ],
    },
  ],
};
