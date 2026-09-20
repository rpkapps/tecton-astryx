import {Card} from '../../Card/Card.js';
import {Divider} from '../Divider.js';
import {Section} from '../../Section/Section.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function DividerVariants() {
  return (
    <Section variant="transparent" width="100%">
      <Card width={400}>
        <VStack gap={3}>
          <VStack gap={1}>
            <Text variant="smallStrong">Sign in with email</Text>
            <Text variant="medium">
              Enter your email and password to access your account.
            </Text>
          </VStack>
          <Divider label="or" />
          <VStack gap={1}>
            <Text variant="smallStrong">Sign in with SSO</Text>
            <Text variant="medium">
              Use your company credentials to sign in automatically.
            </Text>
          </VStack>
          <Divider variant="strong" />
          <Text variant="small" color="secondary">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </VStack>
      </Card>
    </Section>
  );
}
