import {createFileRoute} from '@tanstack/react-router';
import {HomeLayout} from 'fumadocs-ui/layouts/home';
import {Landing} from '@/components/docs/landing';
import {homeOptions, siteDescription, siteName} from '@/lib/layout.shared';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{title: siteName}, {name: 'description', content: siteDescription}],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <HomeLayout {...homeOptions()}>
      <Landing />
    </HomeLayout>
  );
}
