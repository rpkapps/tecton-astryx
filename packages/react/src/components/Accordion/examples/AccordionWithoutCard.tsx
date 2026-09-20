import {Accordion} from '../Accordion.js';
import {Divider} from '../../Divider/Divider.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

/**
 * A flat list on the page background, no card and no group dividers — the
 * Dividers are placed by hand so the rows can carry different spacing than
 * `hasDividers` gives them.
 *
 * Rows, so the triggers take body-semibold rather than the default `large`:
 * these are peers in a list, not section headings. The metadata line under
 * each answer is `supporting`, the one place a third size earns its place.
 */
export function AccordionWithoutCard() {
  return (
    <Stack gap={3} maxWidth={480}>
      <Accordion title="Deployment details" value="deployment">
        <Stack gap={1}>
          <Text variant="medium" color="secondary">
            Build 4,182 shipped to production from <code>main</code>. 847
            modules compiled with no warnings, and the bundle came in at 142 KB
            gzipped — 3 KB under the budget.
          </Text>
          <Text variant="small">
            Deployed by Sarah Chen · April 18, 3:42 PM · 2m 14s
          </Text>
        </Stack>
      </Accordion>

      <Divider />

      <Accordion title="Environment variables" value="environment">
        <Stack gap={1}>
          <Text variant="medium" color="secondary">
            12 variables configured across production and preview. Secrets are
            encrypted at rest with AES-256 and are never printed in build logs.
          </Text>
          <Text variant="small">Last updated March 30 by the deploy bot</Text>
        </Stack>
      </Accordion>

      <Divider />

      <Accordion title="Rollback" value="rollback">
        <Stack gap={1}>
          <Text variant="medium" color="secondary">
            The previous build stays warm for 24 hours, so a rollback swaps
            traffic back in a few seconds without a rebuild. After that window a
            rollback redeploys from source and takes about two minutes.
          </Text>
          <Text variant="small">Previous build 4,181 · expires in 19h</Text>
        </Stack>
      </Accordion>
    </Stack>
  );
}
