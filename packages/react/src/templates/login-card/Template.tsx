import {useState, type CSSProperties} from 'react';
import {Button} from '../../components/Button/Button.js';
import {Card} from '../../components/Card/Card.js';
import {Center} from '../../components/Center/Center.js';
import {Divider} from '../../components/Divider/Divider.js';
import {Heading} from '../../components/Heading/Heading.js';
import {Icon} from '../../components/Icon/Icon.js';
import {Link} from '../../components/Link/Link.js';
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
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setLoginFailed(true);
      return;
    }
    setIsLoading(true);
    setLoginFailed(false);
    setTimeout(() => {
      setIsLoading(false);
      setLoginFailed(true);
    }, 2000);
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
            {/* Header */}
            <VStack gap={1}>
              <Heading level={2}>Welcome back</Heading>
              <Text variant="medium" color="secondary">
                Sign in to your account
              </Text>
            </VStack>

            {/* Form fields */}
            <VStack gap={2}>
              <TextField
                label="Email"
                isLabelHidden
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={setEmail}
                size="md"
              />
              <VStack gap={1}>
                <TextField
                  label="Password"
                  isLabelHidden
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(v: string) => {
                    setPassword(v);
                    setLoginFailed(false);
                  }}
                  size="md"
                  status={
                    loginFailed
                      ? {
                          type: 'error',
                          message: 'Incorrect password. Try again.',
                        }
                      : undefined
                  }
                />
                {loginFailed && (
                  <VStack>
                    <Link href="#" color="secondary">
                      Forgot password?
                    </Link>
                  </VStack>
                )}
              </VStack>
            </VStack>

            {/* Login button */}
            <Button
              label="Login"
              variant="primary"
              size="md"
              isLoading={isLoading}
              onClick={handleLogin}
            />

            {/* Divider */}
            <Divider label="Or continue with" />

            {/* Social buttons */}
            <VStack gap={3}>
              <Button label="Login with Apple" variant="secondary" size="md" />
              <Button label="Login with Google" variant="secondary" size="md" />
            </VStack>

            {/* Sign up link */}
            <VStack>
              <Text variant="small" color="secondary">
                Don&apos;t have an account? <Link href="#">Sign up</Link>
              </Text>
            </VStack>
          </VStack>
        </Card>

        {/* Terms */}
        <VStack width="100%">
          <Text variant="small" color="secondary" align="center">
            By clicking continue, you agree to our{' '}
            <Link href="#">Terms of Service</Link> and{' '}
            <Link href="#">Privacy Policy</Link>.
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
