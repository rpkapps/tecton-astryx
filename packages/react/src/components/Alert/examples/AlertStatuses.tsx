import {Alert} from '../Alert.js';
import {VStack} from '../../VStack/VStack.js';

export function AlertStatuses() {
  return (
    <VStack gap={2}>
      <Alert status="info" title="Two horizons were re-gridded overnight." />
      <Alert status="success" title="Facies model generated." />
      <Alert status="warning" title="Three wells have no deviation survey." />
      <Alert status="error" title="The depth conversion failed." />
      <Alert status="neutral" title="This project is archived." />
    </VStack>
  );
}
