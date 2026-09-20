import {useState} from 'react';
import {LocaleProvider} from '../LocaleProvider.js';
import {Select} from '../../Select/Select.js';

export function InternationalizationProviderOverrides() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <LocaleProvider
      locale="en"
      overrides={{
        en: {
          '@astryx.selector.placeholder': 'Choose...',
        },
      }}
    >
      <Select
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
    </LocaleProvider>
  );
}
