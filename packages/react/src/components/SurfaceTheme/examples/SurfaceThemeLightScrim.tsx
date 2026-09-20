import {AspectRatio} from '../../AspectRatio/AspectRatio.js';
import {Button} from '../../Button/Button.js';
import {Section} from '../../Section/Section.js';
import {Stack} from '../../Stack/Stack.js';
import {SurfaceTheme} from '../SurfaceTheme.js';
import {Text} from '../../Text/Text.js';

const BRIGHT_ROOM_IMAGE_URL = '/template-assets/light-home-square-1.png';

export function SurfaceThemeLightScrim() {
  return (
    <AspectRatio
      ratio={16 / 9}
      style={{
        width: 360,
        maxWidth: '100%',
        borderRadius: 'var(--radius-container)',
      }}
    >
      <img
        src={BRIGHT_ROOM_IMAGE_URL}
        alt="Bright room"
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <Section
        variant="transparent"
        padding={4}
        style={{
          position: 'absolute',
          insetBlockStart: 16,
          insetInlineStart: 16,
          maxWidth: 250,
          background: 'rgba(255,255,255,0.82)',
          borderRadius: 'var(--radius-container)',
          boxShadow: 'var(--shadow-med)',
        }}
      >
        <SurfaceTheme mode="light">
          <Stack direction="vertical" gap={2}>
            <Text variant="medium" weight="bold">
              Bright media surface
            </Text>
            <Text variant="small" color="secondary">
              Use mode="light" when content sits on a light card or scrim.
            </Text>
            <Button label="Open" variant="tertiary" size="sm" />
          </Stack>
        </SurfaceTheme>
      </Section>
    </AspectRatio>
  );
}
