'use client';

import {AspectRatio} from '@tecton/react/AspectRatio';
import {Center} from '@tecton/react/Center';

export function AspectRatioWidescreen() {
  return (
    <Center width={600}>
      <AspectRatio ratio={16 / 9} fit="cover">
        <img
          src="/template-assets/light-scene-horizontal-1.png"
          alt="16:9 widescreen"
        />
      </AspectRatio>
    </Center>
  );
}
