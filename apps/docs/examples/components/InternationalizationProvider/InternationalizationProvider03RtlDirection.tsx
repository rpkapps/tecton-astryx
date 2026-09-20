'use client';

import {useState} from 'react';
import {InternationalizationProvider} from '@tecton/react/i18n';
import {VStack} from '@tecton/react/Layout';
import {Pagination} from '@tecton/react/Pagination';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tecton/react/SegmentedControl';

type TextDirection = 'ltr' | 'rtl';

export function InternationalizationProvider03RtlDirection() {
  const [textDirection, setTextDirection] = useState<TextDirection>('ltr');
  const [page, setPage] = useState(3);
  return (
    <InternationalizationProvider locale="en" dir={textDirection}>
      {/* `dir` on the VStack scopes text direction to this subtree — no extra
          wrapper needed. (VStack has no `direction` prop, so there's nothing to
          confuse with `dir` here.) */}
      <VStack
        gap={4}
        hAlign="center"
        dir={textDirection}
        style={{width: '100%'}}
      >
        <SegmentedControl
          label="Direction"
          value={textDirection}
          onChange={next => setTextDirection(next as TextDirection)}
          size="sm"
        >
          <SegmentedControlItem value="ltr" label="LTR" />
          <SegmentedControlItem value="rtl" label="RTL" />
        </SegmentedControl>
        <Pagination
          page={page}
          onChange={setPage}
          totalItems={200}
          pageSize={10}
          variant="pages"
        />
      </VStack>
    </InternationalizationProvider>
  );
}
