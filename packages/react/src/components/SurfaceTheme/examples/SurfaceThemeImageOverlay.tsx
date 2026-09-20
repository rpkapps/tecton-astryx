import {AspectRatio} from '../../AspectRatio/AspectRatio.js';
import {Button} from '../../Button/Button.js';
import {Section} from '../../Section/Section.js';
import {Stack} from '../../Stack/Stack.js';
import {SurfaceTheme} from '../SurfaceTheme.js';
import {Text} from '../../Text/Text.js';

const LANDSCAPE_IMAGE_URL = '/template-assets/light-scene-horizontal-1.png';

export function SurfaceThemeImageOverlay() {
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
        src={LANDSCAPE_IMAGE_URL}
        alt="Landscape"
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <Section
        variant="transparent"
        padding={4}
        style={{
          position: 'absolute',
          insetInline: 0,
          insetBlockEnd: 0,
          background:
            'linear-gradient(180deg, transparent, rgba(10,19,23,0.78))',
        }}
      >
        <SurfaceTheme mode="dark">
          <Stack direction="vertical" gap={2}>
            <Text variant="medium" weight="bold">
              Product launch livestream
            </Text>
            <Text variant="small" color="secondary">
              MediaTheme keeps overlay text and controls readable without
              hard-coded color overrides.
            </Text>
            <Stack direction="horizontal" gap={2} wrap="wrap">
              <Button label="Watch" size="sm" />
              <Button label="Details" variant="secondary" size="sm" />
            </Stack>
          </Stack>
        </SurfaceTheme>
      </Section>
    </AspectRatio>
  );
}
