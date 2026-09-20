import {useState} from 'react';
import {Avatar} from '../../Avatar/Avatar.js';
import {Card} from '../../Card/Card.js';
import {Icon} from '../../Icon/Icon.js';
import {Pagination} from '../Pagination.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const REVIEWS = [
  {
    name: 'Jeannie Grant',
    date: 'June 01, 2025',
    stars: 5,
    quote:
      'A thorough report was done on our financial situation. Better deals were found and processed on our behalf, which took a lot of stress away.',
  },
  {
    name: 'Derval Russell',
    date: 'November 09, 2025',
    stars: 5,
    quote:
      'I have been a client for 8 years now and have always found the advice provided excellent. They take the time to explain things clearly.',
  },
  {
    name: 'Claire Dawson',
    date: 'October 15, 2025',
    stars: 5,
    quote:
      'Constantly professional and concise. Our mortgage process was smooth from start to finish thanks to their dedicated team.',
  },
  {
    name: 'Marcus Webb',
    date: 'September 22, 2025',
    stars: 4,
    quote:
      'Great service overall. The team was responsive and knowledgeable. Would definitely recommend to anyone looking for solid financial advice.',
  },
];

function Stars({count}: {count: number}) {
  return (
    <Stack direction="horizontal" gap={0}>
      {Array.from({length: count}, (_, i) => (
        <Icon key={i} name={'crown'} size={16} />
      ))}
    </Stack>
  );
}

export function PaginationDotsCarousel() {
  const [page, setPage] = useState(1);
  const review = REVIEWS[page - 1];

  return (
    <Stack direction="vertical" gap={3}>
      <Card padding={5}>
        <Stack direction="vertical" gap={3}>
          <Stars count={review.stars} />
          <Text variant="medium">{review.quote}</Text>
          <Stack direction="horizontal" gap={3}>
            <Avatar name={review.name} size={32} />
            <Stack direction="vertical" gap={0}>
              <Text variant="small" weight="bold">
                {review.name}
              </Text>
              <Text variant="small" color="secondary">
                {review.date}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Card>
      <Pagination
        page={page}
        onChange={setPage}
        totalPages={REVIEWS.length}
        variant="dots"
        style={{justifyContent: 'center', paddingTop: 4}}
      />
    </Stack>
  );
}
