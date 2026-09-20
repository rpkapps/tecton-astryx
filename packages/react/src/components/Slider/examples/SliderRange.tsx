import {useState} from 'react';
import {Slider} from '../Slider.js';
import type {SliderValue} from '../Slider.js';

export function SliderRange() {
  const [depth, setDepth] = useState<SliderValue>([2500, 2650]);

  return (
    <Slider
      label="Depth window"
      value={depth}
      onChange={setDepth}
      min={2400}
      max={2800}
      step={5}
      valueDisplay="text"
      formatValue={value => `${value} m`}
      width={280}
    />
  );
}
