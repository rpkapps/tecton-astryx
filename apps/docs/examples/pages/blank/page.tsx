'use client';

import {Layout, LayoutContent} from '@tecton/react';
import {Text} from '@tecton/react';

export function Page() {
  return (
    <Layout
      content={
        <LayoutContent>
          <Text type="large">New Page</Text>
        </LayoutContent>
      }
    />
  );
}
