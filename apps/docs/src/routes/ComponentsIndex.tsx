import {useNavigate} from 'react-router';
import {Button, Panel} from '@tecton/react';
import {componentRegistry} from '../generated/componentRegistry';

export function ComponentsIndex() {
  const navigate = useNavigate();

  return (
    <>
      <section>
        <h2>Components</h2>
        <p className="prose">
          Every component Tecton ships, with its API and the guidance for using
          it.
        </p>
      </section>
      <div className="card-grid">
        {componentRegistry.map(component => (
          <Panel
            key={component.name}
            title={component.displayName}
            description={component.category}
            actions={
              <Button
                label="Open"
                onClick={() => navigate(`/components/${component.name}`)}
              />
            }
          >
            <p className="prose">{component.usage.description}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
