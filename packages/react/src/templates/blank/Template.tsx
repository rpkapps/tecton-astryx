import {Layout} from '../../components/Layout/Layout.js';
import {LayoutContent} from '../../components/LayoutContent/LayoutContent.js';
import {Text} from '../../components/Text/Text.js';

export function Template() {
  return (
    <Layout
      content={
        <LayoutContent>
          <Text variant="large">New Page</Text>
        </LayoutContent>
      }
    />
  );
}
