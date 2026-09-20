import {Button} from '../../Button/Button.js';
import {HStack} from '../HStack.js';

export function HStackBasic() {
  return (
    <HStack gap={2} align="center">
      <Button label="Cancel" variant="textOnly" />
      <Button label="Apply changes" variant="primary" />
    </HStack>
  );
}
