/*
 * The minimal Tecton consumer, built in CI.
 *
 * Its job is to prove the published surface: an application installs one
 * package, imports one stylesheet, and reaches everything it needs — including
 * icons — without naming anything underneath. `scripts/check-consumer-surface.mjs`
 * reads this directory and fails if the upstream library's name appears.
 */
import {useState} from 'react';
import {
  Button,
  Panel,
  TectonProvider,
  TextField,
  Text,
  VStack,
  useToast,
} from '@tecton/react';
import {Badge} from '@tecton/react/Badge';
import {Icon} from '@tecton/react/icons';
import {tecton} from '@tecton/react/theme';

function Report() {
  const [name, setName] = useState('');
  const toast = useToast();

  return (
    <Panel
      title="Horizons"
      icon="horizon"
      actions={<Badge label="2 active" variant="info" />}
    >
      <VStack gap={3}>
        <TextField
          label="Horizon name"
          value={name}
          onChange={setName}
          placeholder="Type here"
          startIcon="search"
        />
        <Text variant="mediumData" hasTabularNumbers>
          2,525 m TVDSS
        </Text>
        <Button
          label="Save horizon"
          variant="primary"
          icon="add"
          onClick={() => toast({body: `Saved ${name || 'the horizon'}.`})}
        />
        <Text variant="small" color="secondary">
          <Icon name="info" /> Tokens are plain custom properties:{' '}
          {tecton.color.text.primary}
        </Text>
      </VStack>
    </Panel>
  );
}

export function App() {
  return (
    <TectonProvider>
      <Report />
    </TectonProvider>
  );
}
