import {useState} from 'react';
import {Dialog} from '../Dialog.js';

export function DialogAsyncAction() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog
      isOpen
      isInline
      onOpenChange={() => {}}
      title="Revoke access?"
      description="This user will immediately lose access to all shared resources."
      actionLabel="Revoke"
      isActionLoading={isLoading}
      onAction={async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsLoading(false);
      }}
    />
  );
}
