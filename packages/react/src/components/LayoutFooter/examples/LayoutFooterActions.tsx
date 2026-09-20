import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {HStack} from '../../HStack/HStack.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../LayoutFooter.js';

export function LayoutFooterActions() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        content={
          <LayoutContent>
            <Card variant="muted" />
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2}>
              <Button label="Cancel" variant="secondary" label="Cancel" />
              <Button label="Save" variant="primary" label="Save" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Center>
  );
}
