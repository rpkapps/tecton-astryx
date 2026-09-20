import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Dialog} from '../Dialog.js';

export function DialogConfirmation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button label="Delete model" onClick={() => setIsOpen(true)} />
      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Delete Facies Model 01?"
        confirmation={{
          description:
            'The model and every realisation under it are removed. This cannot be undone.',
          actionLabel: 'Delete model',
          onAction: () => setIsOpen(false),
        }}
      />
    </>
  );
}
