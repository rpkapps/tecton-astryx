import {Card} from '../../Card/Card.js';
import {Dialog} from '../../Dialog/Dialog.js';
import {DialogHeader} from '../DialogHeader.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {Text} from '../../Text/Text.js';

export function DialogHeaderShowcase() {
  return (
    <Dialog isOpen isInline onOpenChange={() => {}}>
      <Layout
        header={
          <DialogHeader
            title="Edit Profile"
            subtitle="Update your personal information"
            onOpenChange={() => {}}
          />
        }
        content={
          <LayoutContent>
            <Card variant="muted">
              <Text variant="medium" color="secondary">
                Dialog body content goes here.
              </Text>
            </Card>
          </LayoutContent>
        }
      />
    </Dialog>
  );
}
