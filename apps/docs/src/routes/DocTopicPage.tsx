import {useParams} from 'react-router';
import {Panel} from '@tecton/react';
import {docsRegistry} from '../generated/docsRegistry';
import {NotFound} from './NotFound';

export function DocTopicPage() {
  const {topic} = useParams();
  const doc = docsRegistry.find(entry => entry.name === topic);

  if (!doc) return <NotFound />;

  return (
    <>
      <section>
        <h2>{doc.title}</h2>
        <p className="prose">{doc.description}</p>
      </section>
      {doc.sections.map(section => (
        <Panel key={section.title} title={section.title}>
          {section.content.map((block, index) => (
            <p className="prose" key={index}>
              {block.text}
            </p>
          ))}
        </Panel>
      ))}
    </>
  );
}
