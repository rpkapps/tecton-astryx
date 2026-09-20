/*
 * The minimal Tecton consumer, built in CI.
 *
 * Its job is to prove the published surface: an application installs one
 * package, imports one stylesheet, and reaches everything it needs — including
 * icons — without naming anything underneath. `scripts/check-consumer-surface.mjs`
 * reads this directory and fails if the upstream library's name appears.
 *
 * Everything below a `TectonProvider` is the component system's own API: its
 * names, its props, its types. The only Tecton names here are the provider,
 * the tokens and the glyphs.
 */
import {useState} from 'react';
import {
  Button,
  Card,
  Heading,
  HStack,
  TectonProvider,
  Text,
  TextInput,
  VStack,
  useToast,
} from '@tecton/react';
import {Badge} from '@tecton/react/Badge';
import {Icon} from '@tecton/react/Icon';
import {AddIcon, InfoIcon, SearchIcon} from '@tecton/react/icons';
import {tecton} from '@tecton/react/theme';

function Report() {
  const [name, setName] = useState('');
  const toast = useToast();

  return (
    <Card>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center">
          <Heading level={2}>Horizons</Heading>
          <Badge label="2 active" variant="info" />
        </HStack>

        <TextInput
          label="Horizon name"
          value={name}
          onChange={setName}
          placeholder="Type here"
          startIcon={SearchIcon}
        />
        <Text type="mediumData">2,525 m TVDSS</Text>
        <Button
          label="Save horizon"
          variant="primary"
          icon={<Icon icon={AddIcon} />}
          onClick={() => toast({body: `Saved ${name || 'the horizon'}.`})}
        />
        {/* A theme custom variant: another value for `variant`, not a component. */}
        <Button label="Cancel" variant="text-only" />
        <Text type="supporting">
          <InfoIcon width={16} height={16} aria-hidden="true" /> Tokens are
          plain custom properties: {tecton.color.text.primary}
        </Text>
      </VStack>
    </Card>
  );
}

export function App() {
  return (
    <TectonProvider>
      <Report />
    </TectonProvider>
  );
}
