'use client';

import {useState} from 'react';
import {InternationalizationProvider} from '@tecton/react/i18n';
import {Selector} from '@tecton/react/Selector';

export function InternationalizationProvider02Overrides() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <InternationalizationProvider
      locale="en"
      overrides={{
        en: {
          '@astryx.selector.placeholder': 'Choose...',
        },
      }}
    >
      <Selector
        style={{width: 300}}
        label="Billing region"
        options={[
          {value: 'americas', label: 'Americas'},
          {value: 'emea', label: 'EMEA'},
          {value: 'apac', label: 'APAC'},
        ]}
        value={value}
        onChange={setValue}
        hasClear
      />
    </InternationalizationProvider>
  );
}
