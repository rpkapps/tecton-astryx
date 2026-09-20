import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Dialog} from './Dialog.js';

describe('Dialog', () => {
  it('is not shown while it is closed', () => {
    const {container} = render(
      <TectonProvider>
        <Dialog isOpen={false} onOpenChange={() => undefined} title="Rename">
          Body
        </Dialog>
      </TectonProvider>,
    );

    expect(container.querySelector('dialog')?.open).toBeFalsy();
  });

  it('shows its title and content when it is open', () => {
    render(
      <TectonProvider>
        <Dialog isOpen onOpenChange={() => undefined} title="Rename project">
          <p>Names have to be unique.</p>
        </Dialog>
      </TectonProvider>,
    );

    expect(screen.getByText('Rename project')).toBeInTheDocument();
    expect(screen.getByText('Names have to be unique.')).toBeInTheDocument();
  });

  it('becomes a confirmation when it is given one', () => {
    const onAction = vi.fn();
    render(
      <TectonProvider>
        <Dialog
          isOpen
          onOpenChange={() => undefined}
          title="Delete model?"
          confirmation={{
            description: 'This cannot be undone.',
            actionLabel: 'Delete model',
            onAction,
          }}
        />
      </TectonProvider>,
    );

    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Delete model'}));
    expect(onAction).toHaveBeenCalledOnce();
  });
});
