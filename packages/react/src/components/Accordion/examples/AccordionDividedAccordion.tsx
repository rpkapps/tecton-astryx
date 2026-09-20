import {Accordion} from '../Accordion.js';
import {AccordionGroup} from '../../AccordionGroup/AccordionGroup.js';
import {Link} from '../../Link/Link.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

/**
 * Type sizing, because an FAQ is the case that gets it wrong most often.
 *
 * The trigger's own type is `large` (17px semibold) — right for a settings
 * page where each Collapsible is a section heading, too heavy for a list of
 * ten questions, where every row would read as a heading and none would read
 * as more important than the next.
 *
 * The trigger takes a ReactNode, so a question sets its own type: body at
 * semibold. Question and answer then share one size and separate on weight
 * and color instead — the hierarchy an FAQ actually wants. Answers are
 * `secondary`, which keeps the scannable column of questions primary.
 */
export function AccordionDividedAccordion() {
  return (
    <Stack gap={3} maxWidth={560}>
      <Text variant="smallStrong">Billing and plans</Text>

      <AccordionGroup type="single" hasDividers defaultValue="proration">
        <Accordion
          trigger={
            <Text variant="medium" weight="semibold">
              How is my bill prorated when I change plans mid-cycle?
            </Text>
          }
          value="proration"
        >
          <Stack gap={2}>
            <Text variant="medium" color="secondary">
              Upgrades take effect immediately and we charge the difference for
              the days remaining in the cycle. Downgrades take effect at the
              next renewal, so you keep the higher tier until the period you
              already paid for runs out.
            </Text>
            <Text variant="medium" color="secondary">
              Seat changes work the same way: added seats are prorated to the
              day, removed seats free up at renewal.
            </Text>
          </Stack>
        </Accordion>

        <Accordion
          trigger={
            <Text variant="medium" weight="semibold">
              Can I change my username?
            </Text>
          }
          value="username"
        >
          <Text variant="medium" color="secondary">
            Once every 30 days, from your profile settings. Old links keep
            working — we redirect them for a year.
          </Text>
        </Accordion>

        <Accordion
          trigger={
            <Text variant="medium" weight="semibold">
              What happens to my data if I cancel?
            </Text>
          }
          value="cancel"
        >
          <Stack gap={2}>
            <Text variant="medium" color="secondary">
              Your workspace goes read-only at the end of the billing period.
              Nothing is deleted for 30 days, so reactivating inside that window
              restores everything exactly as it was.
            </Text>
            <Text variant="medium" color="secondary">
              After 30 days the workspace and its backups are permanently
              removed. Export first if you want a copy — an export covers
              documents, comments, and version history.
            </Text>
            <Link href="#export" isStandalone hasUnderline>
              How to export your workspace
            </Link>
          </Stack>
        </Accordion>

        <Accordion
          trigger={
            <Text variant="medium" weight="semibold">
              Do you offer discounts for non-profits or education?
            </Text>
          }
          value="discounts"
        >
          <Text variant="medium" color="secondary">
            Yes — 50% off any paid plan for registered non-profits and
            accredited schools. Email your documentation and we usually apply it
            within two business days.
          </Text>
        </Accordion>
      </AccordionGroup>
    </Stack>
  );
}
