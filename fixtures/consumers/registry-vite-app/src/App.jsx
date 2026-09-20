/**
 * The registry consumer's application.
 *
 * It installs exactly one package — `@tecton/react`, from a registry, with
 * plain `npm install` — and imports one stylesheet. Everything the
 * verification script asserts is reachable from this file:
 *
 *   - a primary Button, whose fill is the theme's accent token, so a browser
 *     can be asked whether the package it installed is actually themed;
 *   - a Dialog and a Menu, so the bundler pulls the scroll lock and the layer
 *     stack into the built JS — the two upstream patches the package vendors
 *     travel with it or they do not, and a grep of `dist/` settles it.
 *
 * The colour mode is pinned rather than left to the OS so the assertion has
 * one value to expect.
 */
import {useState} from 'react';
import {Button, Dialog, Menu, Panel, TectonProvider, Text} from '@tecton/react';

function Report() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Panel title="Installed from a registry" data-testid="panel">
      <Text variant="small">
        One package, one stylesheet, nothing else installed.
      </Text>
      <Button
        data-testid="accent-button"
        variant="primary"
        label="Primary"
        onClick={() => setIsDialogOpen(true)}
      />
      <Menu
        data-testid="menu"
        label="Menu"
        items={[{label: 'Rename', onSelect: () => {}}]}
      />
      <Dialog
        data-testid="dialog"
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="A modal"
      >
        <Text>It locks the page while it is open.</Text>
      </Dialog>
    </Panel>
  );
}

export function App() {
  return (
    <TectonProvider mode="dark">
      <Report />
    </TectonProvider>
  );
}
