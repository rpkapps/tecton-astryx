import {Button, Panel, TectonProvider} from '@tecton/react';

export function App() {
  return (
    <TectonProvider>
      <Panel title="Hello">
        <Button label="Run" />
      </Panel>
    </TectonProvider>
  );
}
