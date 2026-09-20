import {Avatar} from '../Avatar.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function AvatarFallbackChain() {
  return (
    <VStack gap={4}>
      <HStack gap={3}>
        <Avatar
          src="/template-assets/DATA-Daniela-Gimenez.png"
          name="Daniela Gimenez"
          size={40}
        />
        <Text variant="small">Valid src</Text>
      </HStack>
      <HStack gap={3}>
        <Avatar
          src="/template-assets/does-not-exist-primary.jpg"
          fallbackSrc="/template-assets/DATA-Ami-Pena.png"
          name="Invalid User"
          size={40}
        />
        <Text variant="small">Invalid src, valid fallbackSrc</Text>
      </HStack>
      <HStack gap={3}>
        <Avatar
          src="/template-assets/does-not-exist-primary.jpg"
          fallbackSrc="/template-assets/does-not-exist-fallback.jpg"
          name="Test User"
          size={40}
        />
        <Text variant="small">Both invalid, has name</Text>
      </HStack>
      <HStack gap={3}>
        <Avatar src="/template-assets/does-not-exist-primary.jpg" size={40} />
        <Text variant="small">All invalid, no name</Text>
      </HStack>
    </VStack>
  );
}
