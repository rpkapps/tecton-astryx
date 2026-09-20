import {useState} from 'react';
import {FormLayout} from '../FormLayout.js';
import {TextField} from '../../TextField/TextField.js';

export function FormLayoutNested() {
  const [first, setFirst] = useState('Priya');
  const [last, setLast] = useState('Sharma');
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94105');

  return (
    <FormLayout>
      <FormLayout direction="horizontal">
        <TextField label="First Name" value={first} onChange={setFirst} />
        <TextField label="Last Name" value={last} onChange={setLast} />
      </FormLayout>
      <TextField label="Email" value={email} onChange={setEmail} />
      <FormLayout direction="horizontal">
        <TextField label="City" value={city} onChange={setCity} />
        <TextField label="State" value={state} onChange={setState} />
        <TextField label="ZIP" value={zip} onChange={setZip} />
      </FormLayout>
    </FormLayout>
  );
}
