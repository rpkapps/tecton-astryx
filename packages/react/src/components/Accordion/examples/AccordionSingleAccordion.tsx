import {Accordion} from '../Accordion.js';
import {AccordionGroup} from '../../AccordionGroup/AccordionGroup.js';
import {Section} from '../../Section/Section.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

/**
 * type="single": opening one section closes the others, so only one body of
 * content competes for attention at a time. Use `defaultValue` to pre-expand
 * whichever section a first-time reader needs.
 *
 * Each Collapsible owns a Section, so the trigger is that section's heading
 * and keeps its own `large` type.
 */
export function AccordionSingleAccordion() {
  return (
    <AccordionGroup type="single" defaultValue="general">
      <Stack gap={2} maxWidth={440}>
        <Section>
          <Accordion title="General" value="general">
            <Text variant="medium" color="secondary">
              Language, time zone, and date format. Time zone drives every
              timestamp in the product, including exports and scheduled reports.
            </Text>
          </Accordion>
        </Section>

        <Section>
          <Accordion title="Privacy" value="privacy">
            <Text variant="medium" color="secondary">
              Control who can see your profile and activity. Turning off
              discovery also removes you from @-mention autocomplete for people
              outside your workspace.
            </Text>
          </Accordion>
        </Section>

        <Section>
          <Accordion title="Notifications" value="notifications">
            <Text variant="medium" color="secondary">
              Choose what you are notified about and how it reaches you.
              Mentions always come through; everything else can be batched into
              a daily digest.
            </Text>
          </Accordion>
        </Section>
      </Stack>
    </AccordionGroup>
  );
}
