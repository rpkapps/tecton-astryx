'use client';

import {useLayer} from '@tecton/react/Layer';
import {Button} from '@tecton/react/Button';
import {Card} from '@tecton/react/Card';
import {Center} from '@tecton/react/Center';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function LayerHookUsage() {
  const layer = useLayer({mode: 'context', lightDismiss: true});

  return (
    <Center height={220}>
      <Button
        label={layer.isOpen ? 'Hide layer' : 'Show layer'}
        ref={layer.ref}
        onClick={layer.isOpen ? layer.hide : layer.show}
      />
      {layer.render(
        <Card padding={3}>
          <VStack gap={1}>
            <Text type="body" weight="bold">
              Anchored content
            </Text>
            <Text type="body" color="secondary">
              useLayer provides positioning; you own semantics and surface.
            </Text>
          </VStack>
        </Card>,
        {placement: 'below', alignment: 'center'},
      )}
    </Center>
  );
}
