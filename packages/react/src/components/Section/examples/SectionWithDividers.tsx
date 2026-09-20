import {Heading} from '../../Heading/Heading.js';
import {Section} from '../Section.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function SectionWithDividers() {
  return (
    <Stack direction="vertical" gap={0}>
      <Section variant="section" padding={5} dividers={['bottom']}>
        <Stack direction="vertical" gap={1}>
          <Heading level={4}>Account</Heading>
          <Text variant="medium" color="secondary">
            Manage your profile, email, and password.
          </Text>
        </Stack>
      </Section>
      <Section variant="section" padding={5} dividers={['bottom']}>
        <Stack direction="vertical" gap={1}>
          <Heading level={4}>Notifications</Heading>
          <Text variant="medium" color="secondary">
            Choose what updates you receive and how.
          </Text>
        </Stack>
      </Section>
      <Section variant="section" padding={5}>
        <Stack direction="vertical" gap={1}>
          <Heading level={4}>Privacy</Heading>
          <Text variant="medium" color="secondary">
            Control who can see your activity and data.
          </Text>
        </Stack>
      </Section>
    </Stack>
  );
}
