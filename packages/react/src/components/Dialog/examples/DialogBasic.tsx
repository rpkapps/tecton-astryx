import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Text} from '../../Text/Text.js';
import {Dialog} from '../Dialog.js';

export function DialogBasic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button label="Rename project" onClick={() => setIsOpen(true)} />
      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Rename project"
        subtitle="Everyone with access sees the new name."
        dismissal="form"
        footer={
          <Button
            label="Save"
            variant="primary"
            onClick={() => setIsOpen(false)}
          />
        }
      >
        <Text variant="small" color="secondary">
          Project names have to be unique within the team.
        </Text>
      </Dialog>
    </>
  );
}
