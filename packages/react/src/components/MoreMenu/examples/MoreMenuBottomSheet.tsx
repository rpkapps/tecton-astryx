import {MoreMenu} from '../MoreMenu.js';

export function MoreMenuBottomSheet() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        width: 'min(100%, 360px)',
        padding: '16px',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
        <strong>Quarterly plan</strong>
        <span>Updated a few minutes ago</span>
      </div>
      <MoreMenu
        presentation="bottom-sheet"
        label="Project actions"
        items={[
          {
            label: 'Rename project',
            description: 'Update the project title.',
            icon: 'edit-square',
            onClick: () => {},
          },
          {
            label: 'Duplicate project',
            description: 'Create a copy in this workspace.',
            icon: 'copy',
            onClick: () => {},
          },
          {
            label: 'Share project',
            description: 'Invite people to collaborate.',
            icon: 'link',
            onClick: () => {},
          },
          {
            label: 'Delete project',
            description: 'Move this project to the trash.',
            icon: 'delete',
            variant: 'destructive',
            onClick: () => {},
          },
        ]}
      />
    </div>
  );
}
