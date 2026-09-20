'use client';

import {Kbd} from '@tecton/react/Kbd';
import {VStack, HStack} from '@tecton/react/Stack';
import {Text} from '@tecton/react/Text';

export function KbdModifierCombos() {
  return (
    <VStack gap={3}>
      <HStack gap={4}>
        <Kbd keys="mod+k" />
        <Kbd keys="shift+enter" />
        <Kbd keys="ctrl+c" />
        <Kbd keys="alt+tab" />
      </HStack>
      <HStack gap={4}>
        <Kbd keys="mod+shift+z" />
        <Kbd keys="ctrl+alt+delete" />
        <Kbd keys="mod+shift+p" />
      </HStack>
      <HStack gap={4}>
        <Text type="body">Special keys:</Text>
        <Kbd keys="escape" />
        <Kbd keys="enter" />
        <Kbd keys="backspace" />
        <Kbd keys="tab" />
        <Kbd keys="space" />
      </HStack>
    </VStack>
  );
}
