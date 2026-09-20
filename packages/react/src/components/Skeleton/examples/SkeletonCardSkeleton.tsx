import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Skeleton} from '../Skeleton.js';
import {VStack} from '../../VStack/VStack.js';

export function SkeletonCardSkeleton() {
  return (
    <Card width={320}>
      <VStack gap={3}>
        <HStack gap={3}>
          <Skeleton width={40} height={40} radius="rounded" index={0} />
          <VStack gap={1}>
            <Skeleton width={120} height={14} index={1} />
            <Skeleton width={80} height={12} index={2} />
          </VStack>
        </HStack>
        <Skeleton width="100%" height={14} index={3} />
        <Skeleton width="90%" height={14} index={4} />
        <Skeleton width="75%" height={14} index={5} />
      </VStack>
    </Card>
  );
}
