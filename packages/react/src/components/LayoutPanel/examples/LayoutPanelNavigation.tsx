import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutPanel} from '../LayoutPanel.js';
import {List} from '../../List/List.js';
import {ListItem} from '../../ListItem/ListItem.js';

export function LayoutPanelNavigation() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        start={
          <LayoutPanel hasDivider width={140} role="navigation">
            <List>
              <ListItem label="Overview" isSelected />
              <ListItem label="Analytics" />
              <ListItem label="Settings" />
            </List>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <Card variant="muted" />
          </LayoutContent>
        }
      />
    </Center>
  );
}
