import {useState, type CSSProperties} from 'react';
import {Alert} from '../../components/Alert/Alert.js';
import {Button} from '../../components/Button/Button.js';
import {Card} from '../../components/Card/Card.js';
import {Center} from '../../components/Center/Center.js';
import {Heading} from '../../components/Heading/Heading.js';
import {Icon} from '../../components/Icon/Icon.js';
import {Text} from '../../components/Text/Text.js';
import {TextField} from '../../components/TextField/TextField.js';
import {VStack} from '../../components/VStack/VStack.js';

// Standalone auth page paints its own body background (no host shell).
const pageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundColor: 'var(--color-background-body)',
};

export function Template() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Center axis="both" padding={6} style={pageStyle}>
      <VStack gap={4}>
        {/* Logo */}
        <VStack gap={2}>
          <Icon name="cube" size={24} />
          <Text variant="medium" weight="bold">
            Product Inc.
          </Text>
        </VStack>

        {/* Card */}
        <Card padding={8} width="100%">
          <VStack gap={4}>
            <VStack gap={1}>
              <Heading level={2}>Sign in</Heading>
              <Text variant="medium" color="secondary">
                Enter your credentials to continue
              </Text>
            </VStack>

            {error && <Alert status="error" title={error} />}

            <TextField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              type="email"
              size="md"
            />

            <TextField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              type="password"
              size="md"
            />

            <Button
              label="Sign in"
              variant="primary"
              size="md"
              isLoading={isLoading}
              onClick={handleSignIn}
            />
          </VStack>
        </Card>
      </VStack>
    </Center>
  );
}
