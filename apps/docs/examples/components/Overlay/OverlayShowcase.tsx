'use client';

import {Overlay} from '@tecton/react/Overlay';
import {AspectRatio} from '@tecton/react/AspectRatio';
import {Button} from '@tecton/react/Button';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function OverlayShowcase() {
  return (
    <Overlay
      align="center"
      content={
        <VStack gap={2} style={{textAlign: 'center'}}>
          <Text type="supporting" weight="bold" color="inherit">
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
