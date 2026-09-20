import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {BreadcrumbItem} from '../BreadcrumbItem/BreadcrumbItem.js';
import {Breadcrumbs} from './Breadcrumbs.js';

describe('Breadcrumbs', () => {
  it('is a labelled navigation landmark', () => {
    render(
      <TectonProvider>
        <Breadcrumbs label="Project">
          <BreadcrumbItem href="#">Projects</BreadcrumbItem>
          <BreadcrumbItem>Troll West</BreadcrumbItem>
        </Breadcrumbs>
      </TectonProvider>,
    );

    expect(
      screen.getByRole('navigation', {name: 'Project'}),
    ).toBeInTheDocument();
  });
});
