'use client';

import {Layout, LayoutPanel, LayoutContent, Card} from '@tecton/react/Layout';
import {Center} from '@tecton/react/Center';
import {List, ListItem} from '@tecton/react/List';

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
