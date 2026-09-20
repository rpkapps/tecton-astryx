import type {AnchorHTMLAttributes} from 'react';
import {Link} from '../../Link/Link.js';
import {LinkProvider} from '../LinkProvider.js';

/**
 * A stand-in for a framework router link (e.g. Next.js `Link` or React
 * Router `Link`). Instead of letting the browser do a full-page navigation,
 * it intercepts the click and hands the destination to a custom handler —
 * the same hook real routers use for client-side navigation. Here it just
 * announces the target so the behavior swap is observable in the preview.
 */
function RouterLink({
  href,
  onClick,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      onClick={e => {
        e.preventDefault();
        onClick?.(e);
        alert(`RouterLink intercepted navigation to: ${href}`);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export function LinkProviderCustomLink() {
  return (
    <LinkProvider component={RouterLink}>
      <Link href="/dashboard">Go to dashboard</Link>
    </LinkProvider>
  );
}
