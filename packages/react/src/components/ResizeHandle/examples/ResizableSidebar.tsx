import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {ResizeHandle} from '../ResizeHandle.js';
import {useResizable} from '../../../support/index.js';

export function ResizableSidebar() {
  const sidebar = useResizable({
    defaultSize: 240,
    minSize: 160,
    maxSize: 360,
    collapsible: true,
    snaps: [200, 280],
  });

  return (
    <Card variant="muted" width={500}>
      <Layout
        height="fill"
        start={
          <>
            <LayoutPanel width={sidebar.size} hasDivider={false}>
              <Text color="secondary">
                {sidebar.isCollapsed
                  ? ''
                  : `${Math.round(sidebar.size)}px wide`}
              </Text>
            </LayoutPanel>
            <ResizeHandle
              direction="horizontal"
              hasDivider
              resizable={sidebar.props}
              label="Resize sidebar"
            />
          </>
        }
        content={
          <LayoutContent>
            <VStack gap={2}>
              <Text color="secondary">
                Drag the handle — it snaps at 200px and 280px. Drag all the way
                left to collapse the sidebar.
              </Text>
              {sidebar.isCollapsed && (
                <Button
                  label="Expand sidebar"
                  variant="secondary"
                  size="sm"
                  onClick={() => sidebar.expand()}
                />
              )}
            </VStack>
          </LayoutContent>
        }
      />
    </Card>
  );
}
