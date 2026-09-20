import type {CSSProperties} from 'react';
import {Card} from '../../Card/Card.js';
import {Divider} from '../Divider.js';
import {HStack} from '../../HStack/HStack.js';
import {Section} from '../../Section/Section.js';
import {StackItem} from '../../StackItem/StackItem.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const dividerFill: CSSProperties = {
  alignSelf: 'stretch',
  height: 'auto',
};

export function DividerVertical() {
  return (
    <Section variant="transparent" width="100%">
      <Card>
        <HStack gap={4} align="stretch">
          <StackItem size="fill">
            <VStack gap={1}>
              <Text variant="smallStrong">Revenue</Text>
              <Text variant="smallStrong">$24,500</Text>
              <Text variant="small" color="secondary">
                +12% vs last month
              </Text>
            </VStack>
          </StackItem>
          <Divider orientation="vertical" />
          <StackItem size="fill">
            <VStack gap={1}>
              <Text variant="smallStrong">Users</Text>
              <Text variant="smallStrong">1,240</Text>
              <Text variant="small" color="secondary">
                +8% vs last month
              </Text>
            </VStack>
          </StackItem>
          <Divider orientation="vertical" />
          <StackItem size="fill">
            <VStack gap={1}>
              <Text variant="smallStrong">Conversion</Text>
              <Text variant="smallStrong">3.2%</Text>
              <Text variant="small" color="secondary">
                -0.5% vs last month
              </Text>
            </VStack>
          </StackItem>
        </HStack>
      </Card>
    </Section>
  );
}
