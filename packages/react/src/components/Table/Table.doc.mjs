/** @type {import('@tecton/docs').ComponentDoc} */
export const docs = {
  name: 'Table',
  displayName: 'Table',
  group: 'Table',
  category: 'Data',

  keywords: ['table', 'rows', 'columns', 'data', 'grid', 'density'],

  usage: {
    description:
      'Table shows rows of records with one column per field. Columns are data, and a column can render its own cell, which is how a Tecton table gets its monospace numbers, its status chips and its row actions.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set the data variant on numeric cells so figures line up in their columns.',
      },
      {
        guidance: true,
        description:
          'Give text-heavy columns an explicit width share, so one long value cannot squeeze the rest.',
      },
      {
        guidance: true,
        description:
          'Use `sm` density for data people scan and `md` for rows they read.',
      },
      {
        guidance: false,
        description:
          'Put more columns on screen than can be read without scrolling sideways.',
      },
    ],
    accessibility:
      'The headers name their columns, so a cell is announced with the column it belongs to.',
    anatomy: [
      {
        name: 'Header',
        required: true,
        description:
          'The column names — the lightest surface in a Tecton table.',
      },
      {
        name: 'Rows',
        required: true,
        description: 'The records.',
      },
      {
        name: 'Cells',
        required: true,
        description: 'One field of one record.',
      },
    ],
  },

  props: [
    {
      name: 'data',
      type: 'readonly Row[]',
      description: 'The rows.',
      required: true,
    },
    {
      name: 'columns',
      type: 'readonly TableColumn<Row>[]',
      description:
        'The columns. Omit them and one is made per field of the first row.',
    },
    {
      name: 'idKey',
      type: 'Extract<keyof Row, string> | ((row: Row) => string | number)',
      description:
        'Which field identifies a row, or a function that returns its key.',
    },
    {
      name: 'density',
      type: 'ControlSize',
      description: 'Row height.',
      default: "'md'",
    },
    {
      name: 'dividers',
      type: 'TableDividers',
      description: 'Which rules are drawn between cells.',
      default: "'rows'",
    },
    {
      name: 'isStriped',
      type: 'boolean',
      description: 'Bands every other row.',
      default: 'false',
    },
    {
      name: 'hasHover',
      type: 'boolean',
      description: 'Highlights the row under the pointer.',
      default: 'false',
    },
    {
      name: 'textOverflow',
      type: "'wrap' | 'truncate'",
      description: 'What a cell does with text too wide for its column.',
      default: "'wrap'",
    },
    {
      name: 'verticalAlign',
      type: "'middle' | 'top' | 'bottom'",
      description: 'Where cell content sits in a row taller than itself.',
      default: "'middle'",
    },
  ],

  examples: [
    'TableBasic',
    'TableInCard',
    'TableRichCellTable',
    'TableShowcase',
    'TableStripedTable',
  ],

  notes: [
    'Tecton names two row heights; the scale underneath has three, so `md` is the middle one and `sm` the tightest.',
    'There is no built-in selection column, sort affordance or pagination footer: those are composed from a checkbox, a header cell that renders its own control, and whatever the page puts under the table.',
    "The design's small-screen table layout has no equivalent.",
  ],
};
