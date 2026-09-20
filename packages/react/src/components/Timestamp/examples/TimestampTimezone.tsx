import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {Timestamp} from '../Timestamp.js';

const DATE = '2026-02-19T17:00:00Z';

export function TimestampTimezone() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          User-facing with timezone
        </Text>
        <Stack direction="horizontal" gap={4}>
          <Timestamp
            value={DATE}
            format="date_time"
            isTimezoneShown
            color="primary"
          />
          <Timestamp
            value={DATE}
            format="time"
            isTimezoneShown
            color="primary"
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          System formats stay machine-readable — never suffixed with a zone
        </Text>
        <Stack direction="horizontal" gap={4}>
          <Timestamp
            value={DATE}
            format="system_date_time"
            type="code"
            color="primary"
          />
          <Timestamp
            value={DATE}
            format="system_time"
            type="code"
            color="primary"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
