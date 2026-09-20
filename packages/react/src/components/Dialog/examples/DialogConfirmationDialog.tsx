import {Button} from '../../Button/Button.js';
import {Dialog} from '../Dialog.js';
import {DialogHeader} from '../../DialogHeader/DialogHeader.js';
import {HStack} from '../../HStack/HStack.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {Text} from '../../Text/Text.js';
import {useImperativeDialog} from '../../../support/index.js';

function Content({onClose}: {onClose: () => void}) {
  return (
    <Layout
      header={
        <DialogHeader title="Delete project?" onOpenChange={() => onClose()} />
      }
      content={
        <LayoutContent>
          <Text variant="medium">
            This will permanently delete &quot;Marketing Dashboard&quot; and all
            of its data. This action cannot be undone.
          </Text>
        </LayoutContent>
      }
      footer={
        <LayoutFooter>
          <HStack gap={2}>
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
