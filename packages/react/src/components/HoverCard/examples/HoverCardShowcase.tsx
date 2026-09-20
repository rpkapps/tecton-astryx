import {Avatar} from '../../Avatar/Avatar.js';
import {Button} from '../../Button/Button.js';
import {Heading} from '../../Heading/Heading.js';
import {HoverCard} from '../HoverCard.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function HoverCardShowcase() {
  return (
    <HoverCard
      placement="above"
      content={
        <Stack direction="vertical" gap={2}>
          <Stack direction="horizontal" gap={2}>
            <Avatar name="Jane Doe" size={40} />
            <Stack direction="vertical" gap={0}>
              <Heading level={5}>Jane Doe</Heading>
              <Text variant="small" color="secondary">
                Software Engineer
              </Text>
            </Stack>
          </Stack>
          <Text variant="medium" color="secondary">
            Building great products with great people.
          </Text>
        </Stack>
      }
    >
      <Button label="@janedoe" variant="tertiary" />
    </HoverCard>
  );
}
