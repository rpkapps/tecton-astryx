import {useState} from 'react';
import {Center} from '../../Center/Center.js';
import {TextField} from '../../TextField/TextField.js';
import {VStack} from '../../VStack/VStack.js';

export function FieldRequired() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Center>
      <VStack gap={4}>
        <TextField
          label="Username"
          isRequired
          value={username}
          onChange={setUsername}
          placeholder="Enter your username"
        />
        <TextField
          label="Backup email"
          isOptional
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
      </VStack>
    </Center>
  );
}
