'use client';

import {useState} from 'react';
import {InternationalizationProvider} from '@tecton/react/i18n';
import frFR from '@tecton/react/locales/fr-FR.json';
import {Stack} from '@tecton/react/Layout';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tecton/react/SegmentedControl';
import {Selector} from '@tecton/react/Selector';

type Locale = 'en' | 'fr-FR';

export function InternationalizationProvider01ShippedLocale() {
  const [locale, setLocale] = useState<Locale>('en');
  const [value, setValue] = useState<string | null>(null);
  return (
    <InternationalizationProvider locale={locale} messages={{'fr-FR': frFR}}>
      <Stack direction="vertical" gap={4} hAlign="center">
        <SegmentedControl
          label="Language"
          value={locale}
          onChange={nextLocale => setLocale(nextLocale as Locale)}
          size="sm"
        >
          <SegmentedControlItem value="en" label="EN" />
          <SegmentedControlItem value="fr-FR" label="FR" />
        </SegmentedControl>
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
      </Stack>
    </InternationalizationProvider>
  );
}
