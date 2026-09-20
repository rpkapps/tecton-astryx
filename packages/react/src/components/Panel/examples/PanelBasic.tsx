import {Panel} from '../Panel.js';
import {Text} from '../../Text/Text.js';

export function PanelBasic() {
  return (
    <Panel title="2 Horizons" icon="horizon">
      <Text variant="small" color="secondary">
        Spekk fm top and Draupne fm top, gridded at 25 m.
      </Text>
    </Panel>
  );
}
