import {HStack} from '../../HStack/HStack.js';
import {Outline} from '../Outline.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import type {OutlineEntry as OutlineItem} from '../../../support/index.js';

const items: OutlineItem[] = [
  {id: 'density-getting-started', label: 'Getting started', level: 2},
  {id: 'density-configuration', label: 'Configuration', level: 2},
  {id: 'density-api', label: 'API reference', level: 3},
  {id: 'density-examples', label: 'Examples', level: 3},
  {id: 'density-faq', label: 'FAQ', level: 2},
];

export function OutlineDensity() {
  return (
    <HStack gap={10}>
      <VStack gap={3}>
        <Text variant="small" color="secondary" weight="medium">
          Default
        </Text>
        <Outline
          items={items}
          density="default"
          activeId="density-configuration"
        />
      </VStack>
      <VStack gap={3}>
        <Text variant="small" color="secondary" weight="medium">
          Compact
        </Text>
        <Outline
          items={items}
          density="compact"
          activeId="density-configuration"
        />
      </VStack>
    </HStack>
  );
}
