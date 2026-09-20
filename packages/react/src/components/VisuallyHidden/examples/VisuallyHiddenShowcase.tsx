import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../../Icon/Icon.js';
import {IconButton} from '../../IconButton/IconButton.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {VisuallyHidden} from '../VisuallyHidden.js';

const actions = [
  {label: 'Download', icon: 'export-upload'},
  {label: 'Share', icon: 'link'},
  {label: 'Delete', icon: 'delete'},
] as const;

/**
 * VisuallyHidden is invisible by design, so this hero teaches the concept by
 * contrast: the icon-only buttons are all a sighted user sees, while the
 * caption spells out the accessible name each one exposes. A live
 * <VisuallyHidden> region below announces the same names to assistive tech,
 * so the demo genuinely exercises the component it documents.
 */
export function VisuallyHiddenShowcase() {
  return (
    <VStack gap={5}>
      <HStack gap={6} wrap="wrap">
        <Card variant="muted">
          <VStack gap={4}>
            <Text variant="small" color="secondary">
              What you see
            </Text>
            <HStack gap={2}>
              {actions.map(({label, icon}) => (
                <IconButton
                  key={label}
                  label={label}
                  icon={<Icon name={icon} />}
                  variant="tertiary"
                />
              ))}
            </HStack>
          </VStack>
        </Card>

        <Card variant="muted">
          <VStack gap={4}>
            <HStack gap={2}>
              <Icon name={'microphone'} size={16} />
              <Text variant="small" color="secondary">
                What a screen reader hears
              </Text>
            </HStack>
            <VStack gap={2}>
              {actions.map(({label}) => (
                <Text key={label} variant="medium">
                  {label}, button
                </Text>
              ))}
            </VStack>
          </VStack>
        </Card>
      </HStack>

      {/* A real live region: silent to sighted users, announced by AT. */}
      <VisuallyHidden as="div" aria-live="polite">
        Actions available: Download, Share, Delete.
      </VisuallyHidden>
    </VStack>
  );
}
