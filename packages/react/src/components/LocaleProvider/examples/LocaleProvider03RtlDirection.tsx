import {useState} from 'react';
import {LocaleProvider} from '../LocaleProvider.js';
import {Pagination} from '../../Pagination/Pagination.js';
import {ToggleButtonGroup} from '../../ToggleButtonGroup/ToggleButtonGroup.js';
import {ToggleButtonGroupSegment} from '../../ToggleButtonGroupSegment/ToggleButtonGroupSegment.js';
import {VStack} from '../../VStack/VStack.js';

type TextDirection = 'ltr' | 'rtl';

export function InternationalizationProviderRtlDirection() {
  const [textDirection, setTextDirection] = useState<TextDirection>('ltr');
  const [page, setPage] = useState(3);
  return (
    <LocaleProvider locale="en" dir={textDirection}>
      {/* `dir` on the VStack scopes text direction to this subtree — no extra
          wrapper needed. (VStack has no `direction` prop, so there's nothing to
          confuse with `dir` here.) */}
      <VStack gap={4} dir={textDirection}>
        <ToggleButtonGroup
          label="Direction"
          value={textDirection}
          onChange={next => setTextDirection(next as TextDirection)}
          size="sm"
        >
          <ToggleButtonGroupSegment value="ltr" label="LTR" />
          <ToggleButtonGroupSegment value="rtl" label="RTL" />
        </ToggleButtonGroup>
        <Pagination
          page={page}
          onChange={setPage}
          totalItems={200}
          pageSize={10}
          variant="pages"
        />
      </VStack>
    </LocaleProvider>
  );
}
