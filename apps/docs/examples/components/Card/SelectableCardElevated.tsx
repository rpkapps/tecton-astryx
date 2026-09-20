'use client';

import {useState} from 'react';
import {SelectableCard} from '@tecton/react/SelectableCard';
import {Grid} from '@tecton/react/Grid';
import {Text} from '@tecton/react/Text';

const PLANS = [
  {id: 'starter', name: 'Starter'},
  {id: 'pro', name: 'Pro'},
];

export function SelectableCardElevated() {
  const [selected, setSelected] = useState('pro');

  return (
    <Grid columns={2} gap={3} width={420}>
      {PLANS.map(plan => (
        <SelectableCard
          key={plan.id}
          label={plan.name}
          isSelected={selected === plan.id}
          onChange={() => setSelected(plan.id)}
          elevation="low"
        >
          <Text type="body" weight="bold">
            {plan.name}
          </Text>
          <Text type="supporting" color="secondary">
            The resting shadow stays put — the selection ring layers on top.
          </Text>
        </SelectableCard>
      ))}
    </Grid>
  );
}
