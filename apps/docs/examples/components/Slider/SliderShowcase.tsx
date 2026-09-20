'use client';

import {useState} from 'react';
import {Slider} from '@tecton/react/Slider';

export function SliderShowcase() {
  const [value, setValue] = useState(50);
  return (
    <Slider
      label="Volume"
      value={value}
      onChange={setValue}
      style={{width: 300}}
    />
  );
}
