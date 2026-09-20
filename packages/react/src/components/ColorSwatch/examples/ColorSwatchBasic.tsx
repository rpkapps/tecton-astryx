import {useState} from 'react';
import {ColorSwatch} from '../ColorSwatch.js';
import {HStack} from '../../HStack/HStack.js';

const facies = [
  {name: 'Floodplain', color: '#5a7fb5'},
  {name: 'Levee sand', color: '#8a8f4e'},
  {name: 'Channel sand', color: '#c2867a'},
  {name: 'Crevasse splay', color: '#9a8fb0'},
];

export function ColorSwatchBasic() {
  const [selected, setSelected] = useState('Channel sand');

  return (
    <HStack gap={2} align="center">
      {facies.map(entry => (
        <ColorSwatch
          key={entry.name}
          color={entry.color}
          label={entry.name}
          size={12}
          isSelected={selected === entry.name}
          onClick={() => setSelected(entry.name)}
        />
      ))}
    </HStack>
  );
}
