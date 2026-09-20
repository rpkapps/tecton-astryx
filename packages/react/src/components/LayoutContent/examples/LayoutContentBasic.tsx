import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../LayoutContent.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutContentBasic() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <Card variant="muted" />
          </LayoutHeader>
        }
        content={
          <LayoutContent role="main">
            <VStack gap={3}>
              <Heading level={5}>Main Content</Heading>
              <Text variant="medium" color="secondary">
                LayoutContent fills the remaining space and scrolls when its
                content overflows, while the header stays fixed.
              </Text>
            </VStack>
          </LayoutContent>
        }
      />
    </Center>
  );
}
