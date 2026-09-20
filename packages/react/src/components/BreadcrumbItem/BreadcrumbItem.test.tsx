import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Breadcrumbs} from '../Breadcrumbs/Breadcrumbs.js';
import {BreadcrumbItem} from './BreadcrumbItem.js';

describe('BreadcrumbItem', () => {
  it('links the ancestors and marks the last crumb as the current page', () => {
    render(
      <TectonProvider>
        <Breadcrumbs>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem>Troll West</BreadcrumbItem>
        </Breadcrumbs>
      </TectonProvider>,
    );

    expect(screen.getByRole('link', {name: 'Projects'})).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getByText('Troll West')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
