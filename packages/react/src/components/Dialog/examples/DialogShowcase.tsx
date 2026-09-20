import {Dialog} from '../Dialog.js';
import {DialogHeader} from '../../DialogHeader/DialogHeader.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {Text} from '../../Text/Text.js';

// Remove isInline for production — dialogs should be modal.
export function DialogShowcase() {
  return (
    <Dialog isOpen isInline onOpenChange={() => {}}>
      <Layout
        header={<DialogHeader title="Modal Title" onOpenChange={() => {}} />}
        content={
          <LayoutContent>
            <Text variant="medium">Dialog content goes here.</Text>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}
