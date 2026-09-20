import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Button} from '../Button/Button.js';
import {ButtonGroup} from './ButtonGroup.js';

describe('ButtonGroup', () => {
  it('labels the group and sizes its children', () => {
    render(
      <TectonProvider>
        <ButtonGroup label="Export format" size="sm">
          <Button label="LAS" />
          <Button label="SEG-Y" />
        </ButtonGroup>
      </TectonProvider>,
    );

    const group = screen.getByRole('group', {name: 'Export format'});
    expect(group).toHaveAttribute('data-size', 'sm');
    expect(screen.getByRole('button', {name: 'LAS'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'SEG-Y'})).toBeInTheDocument();
  });

  it('disables every button in the group', () => {
    render(
      <TectonProvider>
        <ButtonGroup label="Export format" isDisabled>
          <Button label="LAS" />
        </ButtonGroup>
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'LAS'})).toBeDisabled();
  });
});
