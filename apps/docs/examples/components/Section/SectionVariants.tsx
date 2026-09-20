'use client';

import {Section} from '@tecton/react/Section';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function SectionVariants() {
  return (
    <Stack direction="vertical" gap={6}>
      <Section variant="section" padding={5}>
        <Stack direction="vertical" gap={1}>
          <Text type="body" weight="bold">
            Section
          </Text>
          <Text type="supporting" color="secondary">
            White background.
          </Text>
        </Stack>
      </Section>
      <Section variant="muted" padding={5}>
        <Stack direction="vertical" gap={1}>
          <Text type="body" weight="bold">
            Wash
          </Text>
          <Text type="supporting" color="secondary">
            Gray background.
          </Text>
        </Stack>
      </Section>
      <Stack direction="vertical">
        <Section variant="transparent" padding={5}>
          <Stack direction="vertical" gap={1}>
            <Text type="body" weight="bold">
              Transparent
            </Text>
            <Text type="supporting" color="secondary">
              No background, shows the color behind it.
            </Text>
          </Stack>
        </Section>
      </Stack>
    </Stack>
  );
}
