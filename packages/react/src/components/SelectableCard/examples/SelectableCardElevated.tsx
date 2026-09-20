import {useState} from 'react';
import {Grid} from '../../Grid/Grid.js';
import {SelectableCard} from '../SelectableCard.js';
import {Text} from '../../Text/Text.js';

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
          <Text variant="medium" weight="bold">
            {plan.name}
          </Text>
          <Text variant="small" color="secondary">
            The resting shadow stays put — the selection ring layers on top.
          </Text>
        </SelectableCard>
      ))}
    </Grid>
  );
}
