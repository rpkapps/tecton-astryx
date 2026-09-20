import {Outline} from '../Outline.js';
import type {OutlineEntry as OutlineItem} from '../../../support/index.js';

const items: OutlineItem[] = [
  {id: 'showcase-overview', label: 'Overview', level: 2},
  {id: 'showcase-installation', label: 'Installation', level: 2},
  {id: 'showcase-theming', label: 'Theming', level: 2},
  {id: 'showcase-tokens', label: 'Tokens', level: 3},
  {id: 'showcase-accessibility', label: 'Accessibility', level: 2},
];

export function OutlineShowcase() {
  return (
    <div style={{width: 240}}>
      <Outline items={items} activeId="showcase-theming" />
    </div>
  );
}
