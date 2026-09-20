'use client';

import {useState} from 'react';
import {CheckboxList, CheckboxListItem} from '@tecton/react/CheckboxList';

export function CheckboxListItemBasic() {
  const [value, setValue] = useState<string[]>(['updates']);

  return (
    <CheckboxList label="Email preferences" value={value} onChange={setValue}>
      <CheckboxListItem
        label="Product updates"
        value="updates"
        description="New features and improvements"
      />
      <CheckboxListItem
        label="Security alerts"
        value="security"
        description="Important account security notifications"
      />
      <CheckboxListItem
        label="Marketing"
        value="marketing"
        description="Tips, offers, and promotions"
      />
    </CheckboxList>
  );
}
