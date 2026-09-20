import {AspectRatio} from '../AspectRatio.js';
import {Center} from '../../Center/Center.js';
import {Skeleton} from '../../Skeleton/Skeleton.js';

export function AspectRatioWithSkeleton() {
  return (
    <Center width={600}>
      <AspectRatio ratio={16 / 9}>
        <Skeleton width="100%" height="100%" />
      </AspectRatio>
    </Center>
  );
}
