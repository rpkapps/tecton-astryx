import {Text} from '../Text.js';

export function TextWordBreak() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 400,
      }}
    >
      <div>
        <Text variant="smallStrong" display="block">
          Break-word (default for multi-line)
        </Text>
        <div style={{width: 200, border: '1px solid #ccc', padding: 8}}>
          <Text variant="medium" maxLines={2}>
            This is a verylongunbreakableword for a break-word example
          </Text>
        </div>
      </div>
      <div>
        <Text variant="smallStrong" display="block">
          Break-all (default for single-line)
        </Text>
        <div style={{width: 200, border: '1px solid #ccc', padding: 8}}>
          <Text variant="medium" maxLines={2}>
            Breaks anywhere: abcdefghijklmnopqrstuvwxyz0123456789
          </Text>
        </div>
      </div>
    </div>
  );
}
