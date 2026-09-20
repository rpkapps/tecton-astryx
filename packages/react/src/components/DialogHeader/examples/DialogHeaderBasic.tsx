import {Dialog} from '../../Dialog/Dialog.js';
import {DialogHeader} from '../DialogHeader.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {Text} from '../../Text/Text.js';

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
            <Text variant="medium" color="secondary">
              Dialog body content goes here.
            </Text>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}
