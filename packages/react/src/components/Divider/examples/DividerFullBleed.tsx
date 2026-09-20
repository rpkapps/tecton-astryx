import {Card} from '../../Card/Card.js';
import {Divider} from '../Divider.js';
import {HStack} from '../../HStack/HStack.js';
import {Section} from '../../Section/Section.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function DividerFullBleed() {
  return (
    <Section variant="transparent" width="100%">
      <Card width={400}>
        <VStack gap={3}>
          <Text variant="smallStrong">Order Summary</Text>
          <HStack>
            <Text variant="medium">3 items</Text>
            <Text variant="medium">$127.00</Text>
          </HStack>
          <Divider isFullBleed />
          <HStack>
            <Text variant="medium">Shipping</Text>
            <Text variant="medium">$7.99</Text>
          </HStack>
          <HStack>
            <Text variant="medium">Tax</Text>
            <Text variant="medium">$10.16</Text>
          </HStack>
          <Divider isFullBleed />
          <HStack>
            <Text variant="smallStrong">Total</Text>
            <Text variant="smallStrong">$145.15</Text>
          </HStack>
        </VStack>
      </Card>
    </Section>
  );
}
