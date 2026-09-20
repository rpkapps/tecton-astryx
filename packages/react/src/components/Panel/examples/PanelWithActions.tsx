import {IconButton} from '../../IconButton/IconButton.js';
import {Text} from '../../Text/Text.js';
import {Panel} from '../Panel.js';

export function PanelWithActions() {
  return (
    <Panel
      title="AI Agent"
      icon="layers"
      actions={
        <IconButton
          label="More actions"
          icon="more-vert"
          variant="textOnly"
          size="sm"
        />
      }
      onClose={() => undefined}
    >
      <Text variant="small" color="secondary">
        Calculated impact on drilling time and rig schedule (0.5+ days).
      </Text>
    </Panel>
  );
}
