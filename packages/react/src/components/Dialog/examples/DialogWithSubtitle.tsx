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
        <DialogHeader
          title="Transfer project ownership"
          subtitle="This action requires confirmation from the new owner"
        />
      }
      content={
        <LayoutContent>
          <Text variant="medium">
            You are about to transfer &quot;Marketing Dashboard&quot; to Sarah
            Chen. Once accepted, you will lose admin access.
          </Text>
        </LayoutContent>
      }
      footer={
        <LayoutFooter>
          <HStack gap={2}>
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
