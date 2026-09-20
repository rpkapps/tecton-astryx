import {TreeView} from '../TreeView.js';

const noop = () => {};

export function TreeViewNavigationTree() {
  return (
    <TreeView
      items={[
        {
          id: 'nav',
          label: 'Navigation',
          isExpanded: true,
          children: [
            {id: 'home', label: 'Home', onClick: noop},
            {id: 'about', label: 'About', onClick: noop, isSelected: true},
            {id: 'contact', label: 'Contact', onClick: noop},
          ],
        },
      ]}
    />
  );
}
