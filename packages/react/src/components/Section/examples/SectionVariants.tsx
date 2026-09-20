import {Section} from '../Section.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function SectionVariants() {
  return (
    <Stack direction="vertical" gap={6}>
      <Section variant="section" padding={5}>
        <Stack direction="vertical" gap={1}>
          <Text variant="medium" weight="bold">
            Section
          </Text>
          <Text variant="small" color="secondary">
            White background.
          </Text>
        </Stack>
      </Section>
      <Section variant="muted" padding={5}>
        <Stack direction="vertical" gap={1}>
          <Text variant="medium" weight="bold">
            Wash
          </Text>
          <Text variant="small" color="secondary">
            Gray background.
          </Text>
        </Stack>
      </Section>
      <Stack direction="vertical">
        <Section variant="transparent" padding={5}>
          <Stack direction="vertical" gap={1}>
            <Text variant="medium" weight="bold">
              Transparent
            </Text>
            <Text variant="small" color="secondary">
              No background, shows the color behind it.
            </Text>
          </Stack>
        </Section>
      </Stack>
    </Stack>
  );
}
