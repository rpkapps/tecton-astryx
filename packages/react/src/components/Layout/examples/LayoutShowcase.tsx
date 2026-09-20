import {Badge} from '../../Badge/Badge.js';
import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';
import {List} from '../../List/List.js';
import {ListItem} from '../../ListItem/ListItem.js';
import {Section} from '../../Section/Section.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutShowcase() {
  return (
    <Section padding={4}>
      <Layout
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <HStack gap={2}>
              <Heading level={4}>Projects</Heading>
              <Badge variant="info" label="3 active" />
            </HStack>
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider width={140}>
            <List>
              <ListItem label="Dashboard" isSelected />
              <ListItem label="Analytics" />
              <ListItem label="Settings" />
            </List>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <VStack gap={2}>
              <Heading level={5}>Welcome back</Heading>
              <Text variant="medium" color="secondary">
                You have 3 active projects and 2 pending reviews.
              </Text>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2}>
              <Button label="New Project" variant="primary" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Section>
  );
}
