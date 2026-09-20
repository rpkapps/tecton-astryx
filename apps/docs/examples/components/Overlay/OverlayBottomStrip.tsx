'use client';

import {Overlay} from '@tecton/react/Overlay';
import {AspectRatio} from '@tecton/react/AspectRatio';
import {Badge} from '@tecton/react/Badge';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function OverlayBottomStrip() {
  return (
    <Overlay
      position="bottom"
      align="start"
      content={
        <VStack gap={1}>
          <Badge label="New" variant="green" />
          <Text type="body" weight="bold" color="inherit">
            Weekly product highlights
          </Text>
          <Text type="supporting" color="inherit">
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
