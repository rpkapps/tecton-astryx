import {Badge} from '../../Badge/Badge.js';
import {Button} from '../../Button/Button.js';
import {Icon} from '../../Icon/Icon.js';
import {Section} from '../../Section/Section.js';
import {Stack} from '../../Stack/Stack.js';
import {SurfaceTheme} from '../SurfaceTheme.js';
import {Text} from '../../Text/Text.js';

const SHOWCASE_IMAGE_URL = '/template-assets/light-scene-horizontal-1.png';

export function SurfaceThemeShowcase() {
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
      <SurfaceTheme mode="dark">
        <Stack direction="vertical" gap={3}>
          <Stack direction="horizontal" gap={2}>
            <Icon name="info" size={20} />
            <Text variant="medium" weight="bold">
              Media overlay
            </Text>
            <Badge label="Live" />
          </Stack>
          <Text variant="small" color="secondary">
            Text, icons, badges, and button variants inherit legible colors on
            top of the dark image treatment.
          </Text>
          <Stack direction="horizontal" gap={2} wrap="wrap">
            <Button label="Primary" variant="primary" size="sm" />
            <Button label="Secondary" variant="secondary" size="sm" />
            <Button label="Ghost" variant="tertiary" size="sm" />
          </Stack>
        </Stack>
      </SurfaceTheme>
    </Section>
  );
}
