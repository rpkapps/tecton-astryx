/**
 * One micro-frontend container.
 *
 * Both containers render this same source, but each is bundled separately
 * against its own copy of `@tecton/react` — and therefore its own copy of
 * everything underneath it, and its own React. No module instance is shared
 * between them, which is exactly the micro-frontend situation.
 *
 * Nothing here imports anything but `@tecton/react`: a container is an
 * ordinary consumer, and a consumer never sees what Tecton is built on.
 */
import {useImperativeHandle} from 'react';
import {TectonProvider, Button, Panel} from '@tecton/react';

export function Container({id, version, mode, scope, handleRef}) {
  useImperativeHandle(handleRef, () => ({id, version}), [id, version]);

  return (
    <TectonProvider mode={mode} scope={scope}>
      <div data-container={id} data-version={version}>
        <Panel
          data-testid={`${id}-panel`}
          title={`Container ${id.toUpperCase()}`}
          description={`@tecton/react ${version} · mode=${mode} · scope=${scope}`}
        >
          <p data-testid={`${id}-probe-body`}>token probe</p>
          <Button
            data-testid={`${id}-btn-primary`}
            variant="primary"
            label="Primary"
          />
        </Panel>
      </div>
    </TectonProvider>
  );
}
