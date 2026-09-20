import {Card} from '../../Card/Card.js';
import {Center} from '../Center.js';
import {IconButton} from '../../IconButton/IconButton.js';
import {Stack} from '../../Stack/Stack.js';

export function CenterHorizontal() {
  return (
    <Card width={520} padding={2}>
      <Center axis="horizontal" width="100%">
        <Stack direction="horizontal" gap={0}>
          <IconButton
            label="Bold"
            icon="annotate"
            variant="tertiary"
            size="sm"
          />
          <IconButton
            label="Italic"
            icon="annotate"
            variant="tertiary"
            size="sm"
          />
          <IconButton
            label="Underline"
            icon="annotate"
            variant="tertiary"
            size="sm"
          />
          <IconButton label="List" icon="list" variant="tertiary" size="sm" />
          <IconButton label="Link" icon="link" variant="tertiary" size="sm" />
          <IconButton label="Image" icon="image" variant="tertiary" size="sm" />
        </Stack>
      </Center>
    </Card>
  );
}
