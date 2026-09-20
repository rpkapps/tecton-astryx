import {useState, type CSSProperties} from 'react';
import {Button} from '../../components/Button/Button.js';
import {Card} from '../../components/Card/Card.js';
import {Center} from '../../components/Center/Center.js';
import {Divider} from '../../components/Divider/Divider.js';
import {EmptyState} from '../../components/EmptyState/EmptyState.js';
import {Grid} from '../../components/Grid/Grid.js';
import {HStack} from '../../components/HStack/HStack.js';
import {Icon} from '../../components/Icon/Icon.js';
import {Link} from '../../components/Link/Link.js';
import {Section} from '../../components/Section/Section.js';
import {StackItem} from '../../components/StackItem/StackItem.js';
import {Text} from '../../components/Text/Text.js';
import {TextField} from '../../components/TextField/TextField.js';
import {VStack} from '../../components/VStack/VStack.js';

const COVER_IMAGE_URL = '/template-assets/light-working-vertical-1.png';

// Grid emits minmax(MIN, 1fr) where MIN is a hard floor, so MIN plus the
// grid inset and page padding must fit the narrowest phone or the column is
// clipped. 320 − 2×24 (page) − 2×16 (stacked inset) = 240.
const COLUMN_MIN_WIDTH = 240;
// repeat:'fit' (auto-fit) collapses the two columns to one — expanding to fill —
// below 2×MIN + 32(gap) = 512px. The container query reorders the image and
// tightens the inset at that same point, keyed to the card width (not the
// window) so it never desyncs.
// minHeight:100% fills the host so the centered card never leaves an unpainted
// band; Center's padding prop keeps it off the surface edges.
const pageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundColor: 'var(--color-background-body)',
};
const cardWrap: CSSProperties = {
  width: '100%',
  maxWidth: 1000,
  marginInline: 'auto',
};
const coverImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

// The container query lives in a plain <style> tag so it needs NO CSS compiler.
// - Pad the grid, not the Card: the form's Section escapes Card's
//   --container-padding-* vars, which would cancel the inset on the form side.
//   container-type makes the grid the query container for the stack point.
// - repeat:'fit' (auto-fit) collapses the two columns to one below 511px; the
//   query reorders the image (order:-1) and tightens the inset at that point,
//   keyed to the card width (not the window) so it never desyncs.
const LOGIN_SPLIT_CSS = `
.login-split-grid {
  container-type: inline-size;
  container-name: login-split;
  padding: var(--spacing-8);
}
.login-split-image {
  width: 100%;
  order: 0;
}
@container login-split (max-width: 511px) {
  .login-split-grid {
    padding: var(--spacing-4);
  }
  .login-split-image {
    order: -1;
  }
}
`;

export function Template() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setLoginFailed(true);
      return;
    }
    setIsLoading(true);
    setLoginFailed(false);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <Center axis="both" padding={6} style={pageStyle}>
      <style>{LOGIN_SPLIT_CSS}</style>
      <VStack gap={4} width="100%">
        <div style={cardWrap}>
          <Card padding={0} width="100%">
            <Grid
              columns={{minWidth: COLUMN_MIN_WIDTH, repeat: 'fit'}}
              gap={8}
              align="stretch"
            >
              {/* Form */}
              <Section variant="transparent" padding={0} height="100%">
                <VStack gap={4} height="100%">
                  <HStack gap={2}>
                    <Icon name="view-module" />
                    <Text variant="medium" weight="bold">
                      Product Inc.
                    </Text>
                  </HStack>

                  <StackItem size="fill">
                    <Center axis="vertical" height="100%">
                      {isSuccess ? (
                        <EmptyState
                          title="You're signed in"
                          description="Redirecting to your dashboard…"
                          icon="check-circle"
                        />
                      ) : (
                        <VStack gap={4} width="100%">
                          <VStack gap={1}>
                            <Text variant="display1">Welcome back</Text>
                            <Text variant="medium" color="secondary">
                              Login to your Product Inc. account
                            </Text>
                          </VStack>

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
                                        message:
                                          'Incorrect password. Try again.',
                                      }
                                    : undefined
                                }
                              />
                              {loginFailed && (
                                <VStack>
                                  <Link href="#" color="secondary">
                                    Forgot your password?
                                  </Link>
                                </VStack>
                              )}
                            </VStack>
                          </VStack>

                          <Button
                            label="Login"
                            variant="primary"
                            size="md"
                            isLoading={isLoading}
                            onClick={handleLogin}
                          />

                          <Divider label="Or continue with" />

                          <Grid columns={2} gap={3} justify="stretch">
                            <Button
                              label="Apple"
                              variant="secondary"
                              size="md"
                            />
                            <Button
                              label="Google"
                              variant="secondary"
                              size="md"
                            />
                          </Grid>
                        </VStack>
                      )}
                    </Center>
                  </StackItem>

                  {!isSuccess && (
                    <Text variant="small" color="secondary">
                      Don&apos;t have an account? <Link href="#">Sign up</Link>
                    </Text>
                  )}
                </VStack>
              </Section>

              {/* Cover image — the transparent Card clips it to rounded
                  corners (overflow:clip + radius), so the image needs no radius. */}
              <div className="login-split-image">
                <Card variant="transparent" padding={0} width="100%">
                  <img
                    style={coverImage}
                    src={COVER_IMAGE_URL}
                    alt="Two people working at a desk"
                  />
                </Card>
              </div>
            </Grid>
          </Card>
        </div>

        <VStack>
          <Text variant="small" color="secondary">
            By clicking continue, you agree to our{' '}
            <Link href="#">Terms of Service</Link> and{' '}
            <Link href="#">Privacy Policy</Link>.
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
