import {Card} from '../../Card/Card.js';
import {Grid} from '../Grid.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutPanel} from '../../LayoutPanel/LayoutPanel.js';
import {ResizeHandle} from '../../ResizeHandle/ResizeHandle.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {useResizable} from '../../../support/index.js';

const teams = [
  {name: 'Design Systems', members: 8},
  {name: 'Frontend Platform', members: 12},
  {name: 'Developer Experience', members: 6},
  {name: 'Accessibility', members: 4},
  {name: 'Performance', members: 7},
  {name: 'Mobile Infrastructure', members: 9},
];

export function GridResponsiveAutoFit() {
  const gridPanel = useResizable({
    defaultSize: 480,
    minSize: 100,
    maxSize: 480,
  });

  return (
    <Card variant="muted" padding={0} width="100%">
      <Layout
        height="fill"
        start={
          <>
            <LayoutPanel
              width={gridPanel.size}
              hasDivider={false}
              style={{padding: 'var(--spacing-4)'}}
            >
              <Grid
                columns={{minWidth: 180, repeat: 'fit'}}
                gap={4}
                width="100%"
              >
                {teams.map(team => (
                  <Card key={team.name}>
                    <VStack gap={1}>
                      <Text variant="smallStrong" display="block">
                        {team.name}
                      </Text>
                      <Text variant="small" display="block">
                        {team.members} members
                      </Text>
                    </VStack>
                  </Card>
                ))}
              </Grid>
            </LayoutPanel>
            <ResizeHandle
              direction="horizontal"
              hasDivider
              isAlwaysVisible
              resizable={gridPanel.props}
              label="Resize grid"
            />
          </>
        }
        content={<LayoutContent />}
      />
    </Card>
  );
}
