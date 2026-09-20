import {Outline} from '../Outline.js';
import type {OutlineEntry as OutlineItem} from '../../../support/index.js';

const items: OutlineItem[] = [
  {id: 'deep-introduction', label: 'Introduction', level: 1},
  {id: 'deep-concepts', label: 'Core concepts', level: 2},
  {id: 'deep-tokens', label: 'Tokens', level: 3},
  {id: 'deep-color', label: 'Color', level: 4},
  {id: 'deep-spacing', label: 'Spacing', level: 4},
  {id: 'deep-components', label: 'Components', level: 2},
  {id: 'deep-primitives', label: 'Primitives', level: 3},
  {id: 'deep-patterns', label: 'Patterns', level: 3},
  {id: 'deep-resources', label: 'Resources', level: 1},
];

export function OutlineDeepNesting() {
  return (
    <div style={{width: 240}}>
      <Outline items={items} activeId="deep-color" />
    </div>
  );
}
