'use client';

import {ProgressBar} from '@tecton/react/ProgressBar';

export function ProgressBarWithValueLabel() {
  return (
    <ProgressBar
      value={75}
      label="Storage used"
      hasValueLabel
      style={{width: 300}}
    />
  );
}
