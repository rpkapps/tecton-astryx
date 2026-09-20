/* Ported from the upstream example blocks by scripts/port-examples.mjs. */
/** @type {import('@tecton/docs').ExampleDoc} */
export const docs = {
  id: 'DateInputFormats',
  name: 'Formats',
  component: 'DateInput',
  description:
    "The format prop reuses Timestamp's format vocabulary to control how the committed value is displayed: date, date_long (default), date_weekday, and system_date, or a function for a fully custom string. Formatting applies only to the committed value, never to text the user is actively typing.",
};
