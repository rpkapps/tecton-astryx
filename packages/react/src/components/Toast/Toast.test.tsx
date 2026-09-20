import {useRef} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Button} from '../Button/Button.js';
import {useToast, type DismissToast, type ToastPayload} from './useToast.js';

function Raise({payload}: {payload: ToastPayload}) {
  const toast = useToast();
  const dismiss = useRef<DismissToast | null>(null);
  return (
    <>
      <Button
        label="Raise"
        onClick={() => {
          dismiss.current = toast(payload);
        }}
      />
      <Button label="Dismiss" onClick={() => dismiss.current?.()} />
    </>
  );
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

/**
 * The page-wide half: a toast belongs to the page, not to the copy of Tecton
 * that raised it.
 *
 * Two providers here stand in for two containers — one document, one toast bus
 * — and what is asserted is that there is exactly ONE viewport on the page and
 * that both containers' toasts are inside it. Two viewports at identical
 * coordinates, each with a toast drawn on top of the other's, is the measured
 * failure this routing removes (F8/F12 in
 * `docs/engineering/micro-frontends/analysis.md`).
 */
describe('toast routing across providers', () => {
  /** Every toast currently on the page, wherever it was rendered. */
  const toastNodes = () => document.querySelectorAll('[data-toast-id]');

  /** The element a toast is rendered into: the viewport that is showing it. */
  const viewportOf = (text: string) =>
    screen.getByText(text).closest('[data-toast-id]')?.parentElement ?? null;

  it('renders no viewport of its own for a nested provider', () => {
    render(
      <TectonProvider scope="nested">
        <Raise payload={{body: 'from a container with no viewport'}} />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Raise'}));

    // Nothing renders it, so nothing is shown: the toast waits on the bus for
    // a viewport to publish. Dismissing it takes it back off the queue, which
    // is also what keeps this test from leaking into the next one.
    expect(toastNodes()).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', {name: 'Dismiss'}));
  });

  it('lands a nested container’s toast in the root provider’s one viewport', () => {
    render(
      <>
        <TectonProvider>
          <Raise payload={{body: 'from the shell'}} />
        </TectonProvider>
        <TectonProvider scope="nested">
          <Raise payload={{body: 'from the container'}} />
        </TectonProvider>
      </>,
    );

    const [shell, container] = screen.getAllByRole('button', {name: 'Raise'});
    fireEvent.click(shell!);
    fireEvent.click(container!);

    expect(toastNodes()).toHaveLength(2);
    expect(viewportOf('from the shell')).not.toBeNull();
    expect(viewportOf('from the container')).toBe(viewportOf('from the shell'));
  });
});
