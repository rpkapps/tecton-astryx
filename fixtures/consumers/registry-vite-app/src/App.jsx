/**
 * The registry consumer's application.
 *
 * It installs exactly one package — `@tecton/react`, from a registry, with
 * plain `npm install` — and imports one stylesheet. Everything the
 * verification script asserts is reachable from this file:
 *
 *   - a primary Button, whose fill is the theme's accent token, so a browser
 *     can be asked whether the package it installed is actually themed;
 *   - a Dialog and a DropdownMenu, so the bundler pulls the scroll lock and
 *     the layer stack into the built JS — the two upstream patches the package
 *     vendors travel with it or they do not, and a grep of `dist/` settles it.
 *
 * Everything below the provider is the component system's own API, published
 * under Tecton's name. The colour mode is pinned rather than left to the OS so
 * the assertion has one value to expect.
 */
import {useState} from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogHeader,
  DropdownMenu,
  Heading,
  TectonProvider,
  Text,
  VStack,
} from '@tecton/react';

function Report() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card data-testid="panel">
      <VStack gap={3}>
        <Heading level={2}>Installed from a registry</Heading>
        <Text type="supporting">
          One package, one stylesheet, nothing else installed.
        </Text>
        <Button
          data-testid="accent-button"
          variant="primary"
          label="Primary"
          onClick={() => setIsDialogOpen(true)}
        />
        <DropdownMenu
          data-testid="menu"
          button={{label: 'Menu'}}
          items={[{label: 'Rename', onClick: () => {}}]}
        />
        <Dialog
          data-testid="dialog"
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogHeader title="A modal" />
          <Text>It locks the page while it is open.</Text>
        </Dialog>
      </VStack>
    </Card>
  );
}

export function App() {
  return (
    <TectonProvider mode="dark">
      <Report />
    </TectonProvider>
  );
}
