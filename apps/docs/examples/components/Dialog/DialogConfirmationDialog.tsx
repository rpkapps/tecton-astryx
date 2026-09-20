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
        <DialogHeader title="Delete project?" onOpenChange={() => onClose()} />
      }
      content={
        <LayoutContent>
          <Text type="body">
            This will permanently delete &quot;Marketing Dashboard&quot; and all
            of its data. This action cannot be undone.
          </Text>
        </LayoutContent>
      }
      footer={
        <LayoutFooter>
          <HStack gap={2} hAlign="end">
            <Button label="Cancel" variant="secondary" onClick={onClose} />
            <Button label="Delete" variant="destructive" onClick={onClose} />
          </HStack>
        </LayoutFooter>
      }
    />
  );
}

// Remove isInline for production — dialogs should be modal.
export function DialogConfirmationDialog() {
  const dialog = useImperativeDialog({width: 400, purpose: 'form'});

  return (
    <>
      <Dialog
        isOpen
        isInline
        onOpenChange={() => {}}
        width={400}
        purpose="form"
      >
        <Content
          onClose={() => dialog.show(<Content onClose={() => dialog.hide()} />)}
        />
      </Dialog>
      {dialog.element}
    </>
  );
}
