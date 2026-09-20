import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Button} from '../Button/Button.js';
import {useToast, type ToastPayload} from './useToast.js';

function Raise({payload}: {payload: ToastPayload}) {
  const toast = useToast();
  return <Button label="Raise" onClick={() => toast(payload)} />;
}

describe('useToast', () => {
  it('raises a toast from a plain payload, title, body and action alike', () => {
    const onAction = vi.fn();
    render(
      <TectonProvider>
        <Raise
          payload={{
            title: 'Horizon deleted',
            body: 'Spekk fm top is gone.',
            action: {label: 'Undo', onAction},
          }}
        />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Raise'}));

    expect(screen.getByText('Horizon deleted')).toBeInTheDocument();
    expect(screen.getByText('Spekk fm top is gone.')).toBeInTheDocument();

    // The toast viewport is laid out by the stylesheet, which these tests run
    // without, so jsdom computes it as hidden. The toast is in the document and
    // the action works; only the accessibility tree is unavailable here.
    fireEvent.click(screen.getByRole('button', {name: 'Undo', hidden: true}));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('carries the kind of toast through to the card', () => {
    render(
      <TectonProvider>
        <Raise
          payload={{body: 'The depth conversion failed.', type: 'error'}}
        />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Raise'}));

    expect(
      screen.getByText('The depth conversion failed.'),
    ).toBeInTheDocument();
    expect(document.querySelector('[data-type="error"]')).not.toBeNull();
  });
});
