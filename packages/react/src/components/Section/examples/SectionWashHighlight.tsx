import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {Section} from '../Section.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const FEATURES = [
  '10 team members',
  'Unlimited projects',
  'Priority support',
  'Advanced analytics',
];

export function SectionDefaultWithWash() {
  return (
    <Stack direction="vertical" gap={2}>
      <Section variant="section" padding={4}>
        <Stack direction="vertical" gap={3}>
          <Stack direction="vertical" gap={1}>
            <Text variant="display3">Pro Plan</Text>
            <Text variant="medium" color="secondary">
              Everything you need to scale your team.
            </Text>
          </Stack>
          <Stack direction="vertical" gap={2}>
            {FEATURES.map(feature => (
              <Stack key={feature} direction="horizontal" gap={2}>
                <Icon name={'check'} size={16} />
                <Text variant="medium">{feature}</Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Section>
      <Section variant="muted" padding={6}>
        <Stack direction="vertical" gap={2}>
          <Stack direction="horizontal" gap={2}>
            <Text variant="display3">$49</Text>
            <Text variant="small" color="secondary">
              / month
            </Text>
          </Stack>
          <Button label="Upgrade" variant="primary" />
        </Stack>
      </Section>
    </Stack>
  );
}
