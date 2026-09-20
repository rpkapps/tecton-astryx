import {IconButton} from '../IconButton.js';
import {HStack} from '../../HStack/HStack.js';

export function IconButtonBasic() {
  return (
    <HStack gap={1} align="center">
      <IconButton label="More actions" icon="more-vert" variant="tertiary" />
      <IconButton label="Edit" icon="edit-square" variant="secondary" />
      <IconButton label="Close panel" icon="close" variant="textOnly" />
    </HStack>
  );
}
