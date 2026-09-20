'use client';
import {useTheme} from 'next-themes';

/**
 * Which colour mode the page is in, as Tecton names it.
 *
 * The site is exported as static HTML and is dark by default, so the first
 * paint is always dark; `next-themes` resolves the reader's own choice after
 * hydration and this follows it.
 */
export function useSiteMode(): 'dark' | 'light' {
  const {resolvedTheme} = useTheme();
  return resolvedTheme === 'light' ? 'light' : 'dark';
}
