'use client';

import {
  Layout,
  LayoutPanel,
  LayoutContent,
  LayoutHeader,
  LayoutFooter,
  Card,
} from '@tecton/react/Layout';
import {Center} from '@tecton/react/Center';
import {List, ListItem} from '@tecton/react/List';

export function LayoutPanelShowcase() {
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
        start={
          <LayoutPanel hasDivider width={140} role="navigation">
            <List>
              <ListItem label="Overview" isSelected />
              <ListItem label="Analytics" />
              <ListItem label="Reports" />
              <ListItem label="Settings" />
            </List>
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
