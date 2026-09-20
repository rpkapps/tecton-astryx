import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {HStack} from '../../HStack/HStack.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';

export function LayoutFooterShowcase() {
  return (
    <Center width={400}>
      <Layout
        style={{width: '100%'}}
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <Card variant="muted" />
          </LayoutHeader>
        }
        start={
          <LayoutPanel hasDivider width={140}>
            <Card variant="muted" />
          </LayoutPanel>
        }
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
