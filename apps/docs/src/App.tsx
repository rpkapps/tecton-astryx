import {createBrowserRouter} from 'react-router';
import {RootLayout} from './routes/RootLayout';
import {Home} from './routes/Home';
import {DocTopicPage} from './routes/DocTopicPage';
import {ComponentsIndex} from './routes/ComponentsIndex';
import {ComponentPage} from './routes/ComponentPage';
import {NotFound} from './routes/NotFound';

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
]);
