import {Accordion} from '../Accordion.js';
import {AccordionGroup} from '../../AccordionGroup/AccordionGroup.js';
import {Card} from '../../Card/Card.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

/**
 * One Collapsible per Card, several open at once so the reader can compare
 * across them — the case type="multiple" is for.
 *
 * Here the triggers keep their own `large` type: each is the heading of its
 * own surface, not a row in a list, so the 17px semibold is doing the job it
 * was sized for. Compare with the FAQ and Showcase examples, where the rows
 * share a surface and the questions step down to body-semibold.
 */
export function AccordionMultipleAccordion() {
  return (
    <AccordionGroup type="multiple" defaultValue={['features', 'pricing']}>
      <Stack gap={2} maxWidth={440}>
        <Card>
          <Accordion trigger="Features" value="features">
            <Text variant="medium" color="secondary">
              Real-time collaboration, full version history, and granular
              permissions. Every plan includes unlimited documents and unlimited
              guests — seats are counted for editors only.
            </Text>
          </Accordion>
        </Card>

        <Card>
          <Accordion trigger="Pricing" value="pricing">
            <Stack gap={2}>
              <Text variant="medium" color="secondary">
                Free for up to 5 editors. Pro is $12 per editor per month billed
                annually, or $15 month to month.
              </Text>
              <Text variant="small">
                Non-profit and education pricing is 50% off any paid plan.
              </Text>
            </Stack>
          </Accordion>
        </Card>

        <Card>
          <Accordion trigger="Integrations" value="integrations">
            <Text variant="medium" color="secondary">
              Slack, GitHub, Jira, Figma, and 40 more through pre-built
              connectors, plus a REST API and outbound webhooks for anything not
              on the list.
            </Text>
          </Accordion>
        </Card>
      </Stack>
    </AccordionGroup>
  );
}
