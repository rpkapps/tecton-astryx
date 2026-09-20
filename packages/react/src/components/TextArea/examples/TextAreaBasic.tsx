import {useState} from 'react';
import {TextArea} from '../TextArea.js';

export function TextAreaBasic() {
  const [notes, setNotes] = useState('');

  return (
    <TextArea
      label="Design notes"
      value={notes}
      onChange={setNotes}
      placeholder="What changed, and why"
      rows={4}
      maxLength={280}
      width={320}
    />
  );
}
