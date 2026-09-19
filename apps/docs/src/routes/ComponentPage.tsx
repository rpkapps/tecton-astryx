import {useParams} from 'react-router';
import {Panel} from '@tecton/react';
import {componentRegistry} from '../generated/componentRegistry';
import {NotFound} from './NotFound';

export function ComponentPage() {
  const {name} = useParams();
  const component = componentRegistry.find(entry => entry.name === name);

  if (!component) return <NotFound />;

  const {usage, props = []} = component;

  return (
    <>
      <section>
        <h2>{component.displayName}</h2>
        <p className="prose">{usage.description}</p>
      </section>

      {usage.bestPractices && usage.bestPractices.length > 0 ? (
        <Panel title="Best practices">
          <ul>
            {usage.bestPractices.map(practice => (
              <li
                key={practice.description}
                className={practice.guidance ? 'guidance-do' : 'guidance-dont'}
              >
                {practice.description}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {usage.anatomy && usage.anatomy.length > 0 ? (
        <Panel title="Anatomy">
          <dl>
            {usage.anatomy.map(part => (
              <div key={part.name}>
                <dt>
                  {part.name}
                  {part.required ? ' (required)' : ''}
                </dt>
                <dd className="prose">{part.description}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ) : null}

      {props.length > 0 ? (
        <Panel title="Props">
          <table className="prop-table">
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map(prop => (
                <tr key={prop.name}>
                  <th scope="row">
                    <code>{prop.name}</code>
                    {prop.required ? '*' : ''}
                  </th>
                  <td>
                    <code>{prop.type}</code>
                  </td>
                  <td>{prop.default ? <code>{prop.default}</code> : '—'}</td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      ) : null}
    </>
  );
}
