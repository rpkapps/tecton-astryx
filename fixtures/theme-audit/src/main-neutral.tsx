/**
 * The reference render: the exact same examples under upstream's own docs-site
 * theme, `@astryxdesign/theme-neutral`.
 *
 * The example files import `@tecton/react/<Module>`; this entry is built with
 * an alias that sends every one of those to `@astryxdesign/core/<Module>`, so
 * the components are upstream's, unthemed by Tecton. `@tecton/react/icons` is
 * NOT aliased — both renders draw the same Tecton glyphs, so an icon that comes
 * out a different size is the theme's doing and nothing else.
 */
import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css';
import './stage.css';
import {Stage} from './Stage';

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode') === 'light' ? 'light' : 'dark';

const container = document.getElementById('root');
if (container == null) throw new Error('Missing #root element.');

createRoot(container).render(
  <Theme theme={neutralTheme} mode={mode === 'light' ? 'light' : 'dark'}>
    <Stage />
  </Theme>,
);
