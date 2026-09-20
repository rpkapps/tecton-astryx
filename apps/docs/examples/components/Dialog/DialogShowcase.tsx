'use client';

import {Dialog, DialogHeader} from '@tecton/react/Dialog';
import {Layout, LayoutContent} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

// Remove isInline for production — dialogs should be modal.
export function DialogShowcase() {
  return (
    <Dialog isOpen isInline onOpenChange={() => {}}>
      <Layout
        header={<DialogHeader title="Modal Title" onOpenChange={() => {}} />}
        content={
          <LayoutContent>
            <Text type="body">Dialog content goes here.</Text>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}
