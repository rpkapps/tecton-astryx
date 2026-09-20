'use client';

import {ButtonGroup} from '@tecton/react/ButtonGroup';
import {Button} from '@tecton/react/Button';

export function ButtonGroupBasic() {
  return (
    <ButtonGroup label="Text editing actions">
      <Button label="Copy" />
      <Button label="Cut" />
      <Button label="Paste" />
    </ButtonGroup>
  );
}
