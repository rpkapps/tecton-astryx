import {Button} from '../../Button/Button.js';
import {ButtonGroup} from '../ButtonGroup.js';

export function ButtonGroupBasic() {
  return (
    <ButtonGroup label="Export format">
      <Button label="LAS" />
      <Button label="SEG-Y" />
      <Button label="CSV" />
    </ButtonGroup>
  );
}
