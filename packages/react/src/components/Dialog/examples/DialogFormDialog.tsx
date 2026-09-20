import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Dialog} from '../Dialog.js';
import {DialogHeader} from '../../DialogHeader/DialogHeader.js';
import {HStack} from '../../HStack/HStack.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {TextArea} from '../../TextArea/TextArea.js';
import {TextField} from '../../TextField/TextField.js';
import {VStack} from '../../VStack/VStack.js';
import {useImperativeDialog} from '../../../support/index.js';

function Content({onClose}: {onClose: () => void}) {
  const [name, setName] = useState('Ruby Cheung');
  const [bio, setBio] = useState('Design systems engineer');

  return (
    <Layout
      header={
        <DialogHeader
          title="Edit profile"
          subtitle="Update your display name and bio"
          onOpenChange={() => onClose()}
        />
      }
      content={
        <LayoutContent>
          <VStack gap={4}>
            <TextField
              label="Display name"
              value={name}
              onChange={setName}
              placeholder="Enter your name"
            />
            <TextArea
              label="Bio"
              value={bio}
              onChange={setBio}
              placeholder="Tell us about yourself"
            />
          </VStack>
        </LayoutContent>
      }
      footer={
        <LayoutFooter>
          <HStack gap={2}>
            <Button label="Cancel" variant="secondary" onClick={onClose} />
            <Button label="Save" variant="primary" onClick={onClose} />
          </HStack>
        </LayoutFooter>
      }
    />
  );
}

// Remove isInline for production — dialogs should be modal.
export function DialogFormDialog() {
  const dialog = useImperativeDialog({purpose: 'form', width: 480});

  return (
    <>
      <Dialog
        isOpen
        isInline
        onOpenChange={() => {}}
        purpose="form"
        width={480}
      >
        <Content
          onClose={() => dialog.show(<Content onClose={() => dialog.hide()} />)}
        />
      </Dialog>
      {dialog.element}
    </>
  );
}
