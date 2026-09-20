import {Card} from '../../Card/Card.js';
import {Center} from '../Center.js';
import {Icon} from '../../Icon/Icon.js';
import {IconButton} from '../../IconButton/IconButton.js';
import {Stack} from '../../Stack/Stack.js';

export function CenterHorizontal() {
  return (
    <Card width={520} padding={2}>
      <Center axis="horizontal" width="100%">
        <Stack direction="horizontal" gap={0}>
          <IconButton
            label="Bold"
            icon={<Icon name={'annotate'} />}
            variant="tertiary"
            size="sm"
          />
          <IconButton
            label="Italic"
            icon={<Icon name={'annotate'} />}
            variant="tertiary"
            size="sm"
          />
          <IconButton
            label="Underline"
            icon={<Icon name={'annotate'} />}
            variant="tertiary"
            size="sm"
          />
          <IconButton
            label="List"
            icon={<Icon name={'list'} />}
            variant="tertiary"
            size="sm"
          />
          <IconButton
            label="Link"
            icon={<Icon name={'link'} />}
            variant="tertiary"
            size="sm"
          />
          <IconButton
            label="Image"
            icon={<Icon name={'image'} />}
            variant="tertiary"
            size="sm"
          />
        </Stack>
      </Center>
    </Card>
  );
}
