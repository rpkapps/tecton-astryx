'use client';

import {AspectRatio} from '@tecton/react/AspectRatio';
import {Center} from '@tecton/react/Center';

export function AspectRatioCircleImage() {
  return (
    <Center width={300}>
      <AspectRatio ratio={1} shape="ellipse" fit="cover">
        <img
          src="/template-assets/light-home-square-1.png"
          alt="Circular image"
        />
      </AspectRatio>
    </Center>
  );
}
