import {Badge} from '../../Badge/Badge.js';
import {TreeView} from '../TreeView.js';

const noop = () => {};

export function TreeViewMailboxTree() {
  return (
    <TreeView
      items={[
        {
          id: 'inbox',
          label: 'Inbox',
          isExpanded: true,
          endContent: <Badge label="3" />,
          children: [
            {
              id: 'unread',
              label: 'Unread',
              onClick: noop,
              endContent: <Badge label="3" />,
            },
            {id: 'starred', label: 'Starred', onClick: noop},
          ],
        },
        {id: 'sent', label: 'Sent', onClick: noop},
        {
          id: 'drafts',
          label: 'Drafts',
          onClick: noop,
          endContent: <Badge label="1" />,
        },
      ]}
    />
  );
}
