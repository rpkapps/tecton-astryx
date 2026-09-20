'use client';

import {ProgressBar} from '@tecton/react/ProgressBar';

export function ProgressBarIndeterminate() {
  return (
    <ProgressBar isIndeterminate label="Loading..." style={{width: 300}} />
  );
}
