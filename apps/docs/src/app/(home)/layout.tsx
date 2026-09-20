import type {ReactNode} from 'react';
import {HomeLayout} from 'fumadocs-ui/layouts/home';
import {homeOptions} from '@/lib/layout.shared';

export default function Layout({children}: {children: ReactNode}) {
  return <HomeLayout {...homeOptions()}>{children}</HomeLayout>;
}
