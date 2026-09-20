import {useState} from 'react';
import {Accordion} from '../Accordion.js';
import {AccordionGroup} from '../../AccordionGroup/AccordionGroup.js';
import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

/**
 * Controlled: the parent owns which section is open, so something other than
 * a click can move it — a URL parameter, a validation failure jumping to the
 * offending step, or the buttons here.
 *
 * `onChange` gives back the whole open value, `string` for type="single" and
 * `string[]` for type="multiple".
 */
const STEPS = ['profile', 'security', 'billing'] as const;
type Step = (typeof STEPS)[number];

export function AccordionControlledAccordion() {
  const [open, setOpen] = useState<Step>('profile');
  const index = STEPS.indexOf(open);
  const handleOpenChange = (value: string | string[]) => {
    if (typeof value === 'string' && STEPS.includes(value as Step)) {
      setOpen(value as Step);
    }
  };

  return (
    <Stack gap={3} maxWidth={440}>
      <Stack direction="horizontal" gap={2}>
        <Button
          label="Previous"
          variant="secondary"
          size="sm"
          isDisabled={index <= 0}
          onClick={() => setOpen(STEPS[Math.max(0, index - 1)])}
        />
        <Button
          label="Next"
          variant="secondary"
          size="sm"
          isDisabled={index >= STEPS.length - 1}
          onClick={() => setOpen(STEPS[Math.min(STEPS.length - 1, index + 1)])}
        />
        <Text variant="small">
          Step {index + 1} of {STEPS.length}
        </Text>
      </Stack>

      <AccordionGroup type="single" value={open} onChange={handleOpenChange}>
        <Stack gap={2}>
          <Card>
            <Accordion trigger="Profile" value="profile">
              <Text variant="medium" color="secondary">
                Name, email, and photo. Changes save as you type; the email
                address needs confirmation from the new inbox before it takes
                effect.
              </Text>
            </Accordion>
          </Card>

          <Card>
            <Accordion trigger="Security" value="security">
              <Text variant="medium" color="secondary">
                Two-factor authentication, active sessions, and recent login
                history. Signing out of a session revokes its token immediately.
              </Text>
            </Accordion>
          </Card>

          <Card>
            <Accordion trigger="Billing" value="billing">
              <Text variant="medium" color="secondary">
                Invoices, payment method, and plan. Invoices stay downloadable
                for seven years, including after a downgrade.
              </Text>
            </Accordion>
          </Card>
        </Stack>
      </AccordionGroup>
    </Stack>
  );
}
