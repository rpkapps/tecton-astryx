'use client';

import {MediaTheme} from '@tecton/react/theme';
import {Section} from '@tecton/react/Section';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {Button} from '@tecton/react/Button';
import {Badge} from '@tecton/react/Badge';
import {Icon} from '@tecton/react/Icon';

const SHOWCASE_IMAGE_URL = '/template-assets/light-scene-horizontal-1.png';

export function MediaThemeShowcase() {
  return (
    <Section
      variant="transparent"
      padding={4}
      style={{
        width: 360,
        maxWidth: '100%',
        minHeight: 230,
        display: 'flex',
        alignItems: 'flex-end',
        backgroundImage: `linear-gradient(180deg, rgba(10,19,23,0.05) 0%, rgba(10,19,23,0.82) 100%), url(${SHOWCASE_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-container)',
        boxShadow: 'var(--shadow-med)',
      }}
    >
      <MediaTheme mode="dark">
        <Stack direction="vertical" gap={3}>
          <Stack direction="horizontal" gap={2} vAlign="center">
            <Icon icon="info" size="md" />
            <Text type="body" weight="bold">
              Media overlay
            </Text>
            <Badge label="Live" />
          </Stack>
          <Text type="supporting" color="secondary">
            Text, icons, badges, and button variants inherit legible colors on
            top of the dark image treatment.
          </Text>
          <Stack direction="horizontal" gap={2} wrap="wrap">
            <Button label="Primary" variant="primary" size="sm" />
            <Button label="Secondary" variant="secondary" size="sm" />
            <Button label="Ghost" variant="ghost" size="sm" />
          </Stack>
        </Stack>
      </MediaTheme>
    </Section>
  );
}
