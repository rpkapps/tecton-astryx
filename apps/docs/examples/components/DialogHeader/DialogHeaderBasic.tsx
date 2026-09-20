'use client';

import {Dialog, DialogHeader} from '@tecton/react/Dialog';
import {Layout, LayoutContent} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function DialogHeaderBasic() {
  return (
    <Dialog isOpen isInline onOpenChange={() => {}}>
      <Layout
        header={
          <DialogHeader
            title="Invite teammates"
            subtitle="Send invitations to join your workspace"
            onOpenChange={() => {}}
          />
        }
        content={
          <LayoutContent>
            <Text type="body" color="secondary">
              Dialog body content goes here.
            </Text>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}
