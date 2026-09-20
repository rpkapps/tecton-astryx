import {useState} from 'react';
import {FormLayout} from '../FormLayout.js';
import {TextField} from '../../TextField/TextField.js';

export function FormLayoutHorizontal() {
  const [first, setFirst] = useState('Jordan');
  const [last, setLast] = useState('Rivera');

  return (
    <FormLayout direction="horizontal" style={{width: '100%', maxWidth: 400}}>
      <TextField label="First Name" value={first} onChange={setFirst} />
      <TextField label="Last Name" value={last} onChange={setLast} />
    </FormLayout>
  );
}
