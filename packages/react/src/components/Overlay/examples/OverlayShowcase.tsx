import {AspectRatio} from '../../AspectRatio/AspectRatio.js';
import {Button} from '../../Button/Button.js';
import {Overlay} from '../Overlay.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function OverlayShowcase() {
  return (
    <Overlay
      align="center"
      content={
        <VStack gap={2}>
          <Text variant="small" weight="bold" color="inherit">
            Design system foundations
          </Text>
          <Button label="Open gallery" variant="secondary" size="sm" />
        </VStack>
      }
    >
      <AspectRatio
        ratio={16 / 9}
        style={{
          width: 520,
          maxWidth: '100%',
          borderRadius: 16,
          overflow: 'clip',
        }}
      >
        <img
          src="/template-assets/light-scene-horizontal-1.png"
          alt="Abstract landscape"
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AspectRatio>
    </Overlay>
  );
}
