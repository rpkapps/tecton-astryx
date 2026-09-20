import {useState} from 'react';
import {Badge} from '../../Badge/Badge.js';
import {Checkbox} from '../../Checkbox/Checkbox.js';
import {CheckboxGroup} from '../CheckboxGroup.js';

export function CheckboxGroupWithEndContent() {
  const [value, setValue] = useState<string[]>(['free']);
  return (
    <CheckboxGroup
      label="Add-on packages"
      value={value}
      onChange={setValue}
      hasDividers
    >
      <Checkbox
        label="Free tier"
        value="free"
        description="Basic features included"
        endContent={<Badge variant="success" label="$0/mo" />}
      />
      <Checkbox
        label="Pro tier"
        value="pro"
        description="Advanced analytics and integrations"
        endContent={<Badge variant="info" label="$9/mo" />}
      />
      <Checkbox
        label="Enterprise"
        value="enterprise"
        description="Custom solutions and dedicated support"
        endContent={<Badge label="Custom" />}
      />
    </CheckboxGroup>
  );
}
