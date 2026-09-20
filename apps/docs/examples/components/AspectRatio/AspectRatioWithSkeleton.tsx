'use client';

import {AspectRatio} from '@tecton/react/AspectRatio';
import {Skeleton} from '@tecton/react/Skeleton';
import {Center} from '@tecton/react/Center';

export function AspectRatioWithSkeleton() {
  return (
    <Center width={600}>
      <AspectRatio ratio={16 / 9}>
        <Skeleton width="100%" height="100%" />
      </AspectRatio>
    </Center>
  );
}
