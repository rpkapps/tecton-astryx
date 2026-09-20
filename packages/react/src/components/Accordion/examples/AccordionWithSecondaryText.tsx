import {Accordion} from '../Accordion.js';

export function AccordionWithSecondaryText() {
  return (
    <Accordion
      title="Casing string"
      icon="layers"
      secondaryText="4 sections"
      defaultIsOpen={false}
    >
      Conductor, surface, intermediate and production casing.
    </Accordion>
  );
}
