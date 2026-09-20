import {Card} from '../../Card/Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';
import {List} from '../../List/List.js';
import {ListItem} from '../../ListItem/ListItem.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutDualPanelLayout() {
  return (
    <Card width="100%">
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={4}>File Browser</Heading>
          </LayoutHeader>
        }
        start={
          <LayoutPanel width={120} hasDivider>
            <VStack gap={1}>
              <Text variant="smallStrong" color="secondary">
                Folders
              </Text>
              <List>
                <ListItem label="Documents" />
                <ListItem label="Projects" isSelected />
                <ListItem label="Downloads" />
              </List>
            </VStack>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <VStack gap={2}>
              <Text variant="smallStrong" color="secondary">
                Files
              </Text>
              <Card variant="muted">
                <Text variant="medium">
                  Select a folder to view its contents
                </Text>
              </Card>
            </VStack>
          </LayoutContent>
        }
        end={
          <LayoutPanel width={120} hasDivider>
            <VStack gap={2}>
              <Text variant="smallStrong" color="secondary">
                Details
              </Text>
              <Text variant="medium">Select a file to view details</Text>
            </VStack>
          </LayoutPanel>
        }
      />
    </Card>
  );
}
