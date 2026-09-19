import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router';
import {TectonProvider} from '@tecton/react';
import '@tecton/react/styles.css';
import './app.css';
import {router} from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element.');

createRoot(container).render(
  <StrictMode>
    <TectonProvider mode="dark">
      <RouterProvider router={router} />
    </TectonProvider>
  </StrictMode>,
);
