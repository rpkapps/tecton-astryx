import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {useToast} from '../useToast.js';

export function ToastBasic() {
  const toast = useToast();

  return (
    <HStack gap={2} align="center">
      <Button
        label="Save model"
        variant="primary"
        onClick={() => toast({body: 'Facies Model 01 saved.'})}
      />
      <Button
        label="Delete horizon"
        onClick={() =>
          toast({
            title: 'Horizon deleted',
            body: 'Spekk fm top was removed from the project.',
            action: {label: 'Undo', onAction: () => undefined},
          })
        }
      />
    </HStack>
  );
}
