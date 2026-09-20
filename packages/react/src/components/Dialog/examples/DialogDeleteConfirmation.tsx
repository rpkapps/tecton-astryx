import {Dialog} from '../Dialog.js';
import {useImperativeDialog as useImperativeAlertDialog} from '../../../support/index.js';

// Remove isInline for production — alert dialogs should be modal.
export function DialogDeleteConfirmation() {
  const alert = useImperativeAlertDialog();

  const alertProps = {
    title: 'Delete item?',
    description:
      'This action cannot be undone. The item and all its data will be permanently removed.',
    actionLabel: 'Delete',
  } as const;

  return (
    <>
      <Dialog
        isOpen
        isInline
        onOpenChange={() => {}}
        {...alertProps}
        onAction={() =>
          alert.show({...alertProps, onAction: () => alert.hide()})
        }
      />
      {alert.element}
    </>
  );
}
