'use client';

import {Skeleton} from '@tecton/react/Skeleton';
import {HStack, VStack} from '@tecton/react/Layout';

export function SkeletonTableRowSkeleton() {
  return (
    <VStack gap={2}>
      {[0, 1, 2, 3].map(rowIndex => (
        <HStack key={rowIndex} gap={4} vAlign="center">
          <Skeleton width={50} height={16} index={rowIndex * 4} />
          <Skeleton width={180} height={16} index={rowIndex * 4 + 1} />
          <Skeleton width={100} height={16} index={rowIndex * 4 + 2} />
          <Skeleton width={80} height={16} index={rowIndex * 4 + 3} />
        </HStack>
      ))}
    </VStack>
  );
}
