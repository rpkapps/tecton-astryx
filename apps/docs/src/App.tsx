import {createBrowserRouter} from 'react-router';
import {RootLayout} from './routes/RootLayout';
import {Home} from './routes/Home';
import {DocTopicPage} from './routes/DocTopicPage';
import {ComponentsIndex} from './routes/ComponentsIndex';
import {ComponentPage} from './routes/ComponentPage';
import {NotFound} from './routes/NotFound';
import {ThemePreview} from './routes/ThemePreview';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {index: true, element: <Home />},
      {path: 'docs/:topic', element: <DocTopicPage />},
      {path: 'components', element: <ComponentsIndex />},
      {path: 'components/:name', element: <ComponentPage />},
      {path: '*', element: <NotFound />},
    ],
  },
  // Temporary: the Phase 1 theme fidelity gallery, outside the site chrome so
  // the capture is only the design system. Phase 4 removes it.
  {path: '/preview/theme', element: <ThemePreview />},
]);
