/** The Tecton render: the built theme, in whichever mode the query asks for. */
import {createRoot} from 'react-dom/client';
import {TectonProvider} from '@tecton/react';
import type {TectonColorMode} from '@tecton/react';
import '@tecton/react/styles.css';
import './stage.css';
import {Stage} from './Stage';

const params = new URLSearchParams(window.location.search);
const mode: TectonColorMode = params.get('mode') === 'light' ? 'light' : 'dark';

const container = document.getElementById('root');
if (container == null) throw new Error('Missing #root element.');

createRoot(container).render(
  <TectonProvider mode={mode}>
    <Stage />
  </TectonProvider>,
);
