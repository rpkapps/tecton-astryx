import {AspectRatio} from '../../AspectRatio/AspectRatio.js';
import {Badge} from '../../Badge/Badge.js';
import {Overlay} from '../Overlay.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function OverlayBottomStrip() {
  return (
    <Overlay
      position="bottom"
      align="start"
      content={
        <VStack gap={1}>
          <Badge label="New" />
          <Text variant="medium" weight="bold" color="inherit">
            Weekly product highlights
          </Text>
          <Text variant="small" color="inherit">
            12 updates across templates and tokens
          </Text>
        </VStack>
      }
    >
      <AspectRatio
        ratio={16 / 9}
        style={{
          width: 420,
          maxWidth: '100%',
          borderRadius: 12,
          overflow: 'clip',
        }}
      >
        <img
          src="/template-assets/illustrative-horizontal-1.png"
          alt="Product highlight preview"
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AspectRatio>
    </Overlay>
  );
}
