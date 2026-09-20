'use client';

import {Dialog, DialogHeader, useImperativeDialog} from '@tecton/react/Dialog';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  HStack,
} from '@tecton/react/Layout';
import {Button} from '@tecton/react/Button';
import {Text} from '@tecton/react/Text';

function Content({onClose}: {onClose: () => void}) {
  return (
    <Layout
      header={
        <DialogHeader
          title="Transfer project ownership"
          subtitle="This action requires confirmation from the new owner"
        />
      }
      content={
        <LayoutContent>
          <Text type="body">
            You are about to transfer &quot;Marketing Dashboard&quot; to Sarah
            Chen. Once accepted, you will lose admin access.
          </Text>
        </LayoutContent>
      }
      footer={
        <LayoutFooter>
          <HStack gap={2} hAlign="end">
            <Button label="Cancel" variant="secondary" onClick={onClose} />
            <Button label="Transfer" variant="primary" onClick={onClose} />
          </HStack>
        </LayoutFooter>
      }
    />
  );
}

// Remove isInline for production — dialogs should be modal.
export function DialogWithSubtitle() {
  const dialog = useImperativeDialog({purpose: 'required'});

  return (
    <>
      <Dialog isOpen isInline onOpenChange={() => {}} purpose="required">
        <Content
          onClose={() => dialog.show(<Content onClose={() => dialog.hide()} />)}
        />
      </Dialog>
      {dialog.element}
    </>
  );
}
