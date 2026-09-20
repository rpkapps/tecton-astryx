import {useState} from 'react';
import {Center} from '../../Center/Center.js';
import {TextField} from '../../TextField/TextField.js';
import {VStack} from '../../VStack/VStack.js';

export function FieldWithDescription() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Center>
      <VStack gap={4}>
        <TextField
          label="Email"
          description="We'll send a confirmation link to this address"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          description="At least 8 characters with one uppercase letter"
          value={password}
          onChange={setPassword}
          placeholder="Create a password"
        />
      </VStack>
    </Center>
  );
}
