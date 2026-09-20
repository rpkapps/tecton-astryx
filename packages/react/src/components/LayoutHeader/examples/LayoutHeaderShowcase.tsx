import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../LayoutHeader.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';

export function LayoutHeaderShowcase() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <HStack gap={2}>
              <Heading level={4}>Dashboard</Heading>
              <HStack gap={2}>
                <Button label="Export" variant="secondary" label="Export" />
                <Button label="New Item" variant="primary" label="New Item" />
              </HStack>
            </HStack>
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider width={140}>
            <Card variant="muted" />
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <Card variant="muted" />
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
