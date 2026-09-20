import type {Metadata} from 'next';
import {Landing} from '@/components/docs/landing';
import {siteDescription} from '@/lib/layout.shared';

export const metadata: Metadata = {description: siteDescription};

export default function HomePage() {
  return <Landing />;
}
