'use client';

import {useState} from 'react';
import {TextInput} from '@tecton/react/TextInput';
import {VStack} from '@tecton/react/Layout';
import {Center} from '@tecton/react/Center';

export function FieldRequired() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Center>
      <VStack gap={4}>
        <TextInput
          label="Username"
          isRequired
          value={username}
          onChange={setUsername}
          placeholder="Enter your username"
        />
        <TextInput
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
