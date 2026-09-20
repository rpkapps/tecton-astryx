import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';
import {List} from '../../List/List.js';
import {ListItem} from '../../ListItem/ListItem.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutSidebarLayout() {
  return (
    <Card width="100%">
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={4}>Settings</Heading>
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider role="navigation" width={150}>
            <List>
              <ListItem label="General" isSelected />
              <ListItem label="Account" />
              <ListItem label="Privacy" />
              <ListItem label="Notifications" />
              <ListItem label="Security" />
            </List>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <VStack gap={3}>
              <Heading level={5}>General Settings</Heading>
              <Text variant="medium">
                Configure your general preferences here. The sidebar navigation
                allows you to switch between different settings sections.
              </Text>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2}>
              <Button label="Reset" variant="secondary" label="Reset" />
              <Button
                label="Save Changes"
                variant="primary"
                label="Save Changes"
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  );
}
