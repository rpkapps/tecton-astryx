import {ContextMenu} from '../ContextMenu.js';

export function ContextMenuBottomSheet() {
  return (
    <ContextMenu
      presentation="bottom-sheet"
      label="Document actions"
      items={[
        {
          label: 'Rename document',
          description: 'Change the title shown to collaborators.',
          icon: 'edit-square',
          onClick: () => {},
        },
        {
          label: 'Duplicate document',
          description: 'Create a copy in the same workspace.',
          icon: 'copy',
          onClick: () => {},
        },
        {
          label: 'Share document',
          description: 'Invite people or copy a share link.',
          icon: 'link',
          onClick: () => {},
        },
        {
          label: 'Delete document',
          description: 'Move this document to the trash.',
          icon: 'delete',
          variant: 'destructive',
          onClick: () => {},
        },
      ]}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '32px',
          border: '1px solid #d1d5db',
          borderRadius: '12px',
        }}
      >
        <strong>Quarterly plan</strong>
        <span>Long-press on touch or right-click for document actions.</span>
      </div>
    </ContextMenu>
  );
}
