import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutContentShowcase() {
  return (
    <Center width={500}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <Card variant="muted" />
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider width={140}>
            <Card variant="muted" />
          </LayoutPanel>
        }
        content={
          <LayoutContent role="main">
            <VStack gap={3}>
              <Heading level={5}>Main Content Area</Heading>
              <Text variant="medium" color="secondary">
                LayoutContent provides automatic padding and scroll containment.
                It fills the remaining space between the header and footer.
              </Text>
              <Text variant="medium" color="secondary">
                Content that overflows will scroll within this area while the
                header and footer remain fixed.
              </Text>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <Card variant="muted" />
          </LayoutFooter>
        }
      />
    </Center>
  );
}
