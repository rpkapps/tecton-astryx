import {useNavigate} from 'react-router';
import {Button, Panel} from '@tecton/react';
import {componentRegistry} from '../generated/componentRegistry';
import {docsRegistry} from '../generated/docsRegistry';

export function Home() {
  const navigate = useNavigate();
  const firstTopic = docsRegistry[0];

  return (
    <>
      <section>
        <h2>The Tecton design system</h2>
        <p className="prose">
          Tecton is a React component library: one package, one stylesheet, one
          provider. This site documents every component and the written guidance
          that goes with it.
        </p>
      </section>

      <Panel
        title="Start here"
        description="Install the package, load the stylesheet, render a component."
        actions={
          firstTopic ? (
            <Button
              label="Read the guide"
              variant="primary"
              onClick={() => navigate(`/docs/${firstTopic.name}`)}
            />
          ) : undefined
        }
      >
        <p className="prose">
          {firstTopic?.description ??
            'Documentation topics will appear here once they are written.'}
        </p>
      </Panel>

      <Panel
        title="Components"
        description={`${componentRegistry.length} documented so far.`}
        actions={
          <Button
            label="Browse components"
            onClick={() => navigate('/components')}
          />
        }
      >
        <ul>
          {componentRegistry.map(component => (
            <li key={component.name}>
              {component.displayName} — {component.category ?? 'Uncategorised'}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
