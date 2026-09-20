import {TreeView} from '../TreeView.js';

export function TreeViewBasic() {
  return (
    <TreeView
      header="Project"
      density="condensed"
      items={[
        {
          id: 'horizons',
          label: 'Horizons',
          isExpanded: true,
          items: [
            {id: 'spekk', label: 'Spekk fm top'},
            {id: 'draupne', label: 'Draupne fm top'},
          ],
        },
        {
          id: 'wells',
          label: 'Wells',
          items: [
            {id: 'a', label: '15/9-19 A'},
            {id: 'bt2', label: '15/9-19 BT2'},
          ],
        },
      ]}
    />
  );
}
