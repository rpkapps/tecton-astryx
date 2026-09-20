import {Badge} from '../../Badge/Badge.js';
import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {VisuallyHidden} from '../VisuallyHidden.js';

const items = [
  {name: 'astryx-core', status: 'Passing', variant: 'success'},
  {name: 'astryx-charts', status: 'Failing', variant: 'error'},
  {name: 'astryx-cli', status: 'Passing', variant: 'success'},
] as const;

export function VisuallyHiddenStructuralHeading() {
  return (
    <VStack gap={3}>
      <Text variant="small" color="secondary">
        The layout makes this group obvious to sighted users. A hidden heading
        gives screen-reader users the same landmark to jump to.
      </Text>
      {/* No visible heading is needed here, but AT users navigate by heading. */}
      <VisuallyHidden as="h2">Build status</VisuallyHidden>
      <VStack gap={2}>
        {items.map(({name, status, variant}) => (
          <Card key={name} variant="muted" padding={3}>
            <HStack gap={3}>
              <Text variant="medium">{name}</Text>
              <Badge label={status} variant={variant} />
            </HStack>
          </Card>
        ))}
      </VStack>
    </VStack>
  );
}
