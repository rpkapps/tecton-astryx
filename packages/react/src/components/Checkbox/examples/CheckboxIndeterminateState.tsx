import {useState} from 'react';
import {Checkbox} from '../Checkbox.js';
import {Divider} from '../../Divider/Divider.js';
import {Stack} from '../../Stack/Stack.js';

export function CheckboxIndeterminateState() {
  const [items, setItems] = useState({
    email: true,
    push: false,
    sms: true,
    slack: false,
  });

  const checkedCount = Object.values(items).filter(Boolean).length;
  const totalCount = Object.keys(items).length;
  const selectAllValue =
    checkedCount === 0
      ? false
      : checkedCount === totalCount
        ? true
        : ('indeterminate' as const);

  const handleSelectAll = (checked: boolean) => {
    setItems({email: checked, push: checked, sms: checked, slack: checked});
  };

  return (
    <Stack direction="vertical" gap={3}>
      <Checkbox
        label="Select all notifications"
        description={`${checkedCount} of ${totalCount} enabled`}
        value={selectAllValue}
        onChange={handleSelectAll}
      />
      <Divider />
      <Stack direction="vertical" gap={3}>
        <Checkbox
          label="Email notifications"
          value={items.email}
          onChange={v => setItems(prev => ({...prev, email: v}))}
        />
        <Checkbox
          label="Push notifications"
          value={items.push}
          onChange={v => setItems(prev => ({...prev, push: v}))}
        />
        <Checkbox
          label="SMS alerts"
          value={items.sms}
          onChange={v => setItems(prev => ({...prev, sms: v}))}
        />
        <Checkbox
          label="Slack messages"
          value={items.slack}
          onChange={v => setItems(prev => ({...prev, slack: v}))}
        />
      </Stack>
    </Stack>
  );
}
