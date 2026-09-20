import {Card} from '../../Card/Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutContentOnlyLayout() {
  return (
    <Card width="100%">
      <Layout
        content={
          <LayoutContent>
            <VStack gap={3}>
              <Heading level={4}>Simple Content</Heading>
              <Text variant="medium">
                A layout can have just content without header or footer. This is
                useful for simple cards or content blocks that don&apos;t need
                structured sections.
              </Text>
            </VStack>
          </LayoutContent>
        }
      />
    </Card>
  );
}
