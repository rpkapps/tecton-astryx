import {useState} from 'react';
import {Pagination} from '../Pagination.js';
import {Stack} from '../../Stack/Stack.js';

export function PaginationVariants() {
  const [pagesPage, setPagesPage] = useState(3);
  const [countPage, setCountPage] = useState(2);
  const [compactPage, setCompactPage] = useState(5);
  const [dotsPage, setDotsPage] = useState(3);

  return (
    <Stack direction="vertical" gap={5}>
      <Pagination
        page={dotsPage}
        onChange={setDotsPage}
        totalPages={8}
        variant="dots"
      />
      <Pagination
        page={compactPage}
        onChange={setCompactPage}
        totalPages={10}
        variant="compact"
      />
      <Pagination
        page={countPage}
        onChange={setCountPage}
        totalItems={200}
        pageSize={20}
        variant="count"
      />
      <Pagination
        page={pagesPage}
        onChange={setPagesPage}
        totalItems={200}
        pageSize={10}
        variant="pages"
      />
    </Stack>
  );
}
