'use client';

import {AspectRatio} from '@tecton/react/AspectRatio';
import {Center} from '@tecton/react/Center';

export function AspectRatioSquareImage() {
  return (
    <Center width={300}>
      <AspectRatio ratio={1} fit="cover">
        <img src="/template-assets/light-home-square-1.png" alt="1:1 square" />
      </AspectRatio>
    </Center>
  );
}
