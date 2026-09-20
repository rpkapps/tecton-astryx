import {Avatar} from '../../Avatar/Avatar.js';
import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {HoverCard} from '../HoverCard.js';
import {Icon} from '../../Icon/Icon.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function HoverCardProfileHoverCard() {
  return (
    <HoverCard
      placement="below"
      content={
        <HStack gap={3}>
          <Avatar name="Jane Doe" size={48} />
          <VStack gap={1}>
            <Heading level={3}>@janedoe</Heading>
            <Text variant="medium" color="secondary">
              Crafting accessible, scalable design systems for modern teams.
            </Text>
            <HStack gap={1}>
              <Icon name={'history'} size={16} />
              <Text variant="small" color="secondary">
                March 2024
              </Text>
            </HStack>
          </VStack>
        </HStack>
      }
    >
      <Button label="@janedoe" variant="tertiary" />
    </HoverCard>
  );
}
