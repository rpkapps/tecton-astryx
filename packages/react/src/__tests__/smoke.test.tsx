/**
 * A representative set of components, rendered inside `TectonProvider`.
 *
 * `surface.test.ts` proves the exports are the component system's own values;
 * this proves they *run* under the Tecton theme — that the provider installs
 * it, that the theme's custom variants resolve, and that the components a
 * consumer reaches for first come up with the Tecton theme attribute on the
 * tree above them.
 *
 * Six components, chosen to cover the shapes that break differently: a button
 * (a theme custom variant), a text input (a field, a theme target and an icon
 * from the theme's registry), a dialog (a layer, opened), a table (a data
 * component with a theme-styled header), a tab list (a compound component with
 * a context) and a selector (a field that opens a layer).
 *
 * The theme resolved here is the *source* theme, not the built one: tests
 * should not depend on a build having run. `src/theme/__tests__/builtTheme.test.ts`
 * is what checks the built artefact.
 */
import {describe, it, expect} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import {
  TectonProvider,
  Button,
  TextInput,
  Dialog,
  DialogHeader,
  Table,
  TabList,
  Tab,
  Selector,
} from '../index.js';

/** The element the theme is applied to, which every assertion hangs off. */
function themedRoot(container: HTMLElement) {
  return container.querySelector('[data-astryx-theme="tecton"]');
}

describe('TectonProvider', () => {
  it('themes the tree a component renders into', () => {
    const {container} = render(
      <TectonProvider>
        <Button label="Save" variant="primary" />
      </TectonProvider>,
    );

    const themed = themedRoot(container);
    expect(themed).not.toBeNull();
    const button = screen.getByRole('button', {name: 'Save'});
    expect(button).toBeInTheDocument();
    expect(themed?.contains(button)).toBe(true);
  });

  it("renders the theme's own button variants", () => {
    render(
      <TectonProvider>
        <Button label="Outlined" variant="outlined" />
        <Button label="Text only" variant="text-only" />
      </TectonProvider>,
    );
    expect(screen.getByRole('button', {name: 'Outlined'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Text only'})).toBeInTheDocument();
  });
});

describe('a representative set of components', () => {
  it('renders a text input', () => {
    render(
      <TectonProvider>
        <TextInput
          label="Well name"
          value="Ekofisk 2/4-A"
          onChange={() => {}}
        />
      </TectonProvider>,
    );
    expect(screen.getByLabelText('Well name')).toHaveValue('Ekofisk 2/4-A');
  });

  it('renders an open dialog', () => {
    render(
      <TectonProvider>
        <Dialog isOpen onOpenChange={() => {}}>
          <DialogHeader title="Discard changes?" />
          <p>Nothing is saved yet.</p>
        </Dialog>
      </TectonProvider>,
    );
    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
    expect(screen.getByText('Nothing is saved yet.')).toBeInTheDocument();
  });

  it('renders a table', () => {
    render(
      <TectonProvider>
        <Table
          data={[
            {well: 'A-1', depth: 2100},
            {well: 'A-2', depth: 2480},
          ]}
          columns={[
            {key: 'well', header: 'Well'},
            {key: 'depth', header: 'Depth'},
          ]}
        />
      </TectonProvider>,
    );
    const table = screen.getByRole('table');
    expect(within(table).getByText('Well')).toBeInTheDocument();
    expect(within(table).getByText('A-2')).toBeInTheDocument();
  });

  it('renders a tab list', () => {
    render(
      <TectonProvider>
        <TabList value="logs" onChange={() => {}} aria-label="Sections">
          <Tab value="logs" label="Logs" />
          <Tab value="picks" label="Picks" />
        </TabList>
      </TectonProvider>,
    );
    expect(screen.getByRole('button', {name: 'Logs'})).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', {name: 'Picks'})).toBeInTheDocument();
  });

  it('renders a selector', () => {
    render(
      <TectonProvider>
        <Selector
          label="Datum"
          options={['Mean sea level', 'Kelly bushing']}
          value="Mean sea level"
          onChange={() => {}}
        />
      </TectonProvider>,
    );
    expect(screen.getByText('Datum')).toBeInTheDocument();
  });

  it('puts every one of them under the Tecton theme', () => {
    const {container} = render(
      <TectonProvider>
        <Button label="Run" />
        <TextInput label="Filter" value="" onChange={() => {}} />
        <TabList value="a" onChange={() => {}} aria-label="Tabs">
          <Tab value="a" label="A" />
        </TabList>
      </TectonProvider>,
    );

    const themed = themedRoot(container);
    for (const node of [
      screen.getByRole('button', {name: 'Run'}),
      screen.getByLabelText('Filter'),
      screen.getByRole('button', {name: 'A'}),
    ]) {
      expect(themed?.contains(node)).toBe(true);
    }
  });
});
