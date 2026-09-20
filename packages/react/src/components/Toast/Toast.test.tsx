import {useRef} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Button} from '../Button/Button.js';
import {getToastBus} from '../../runtime/toastBus.js';
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

  it('stands in with one viewport when the page has no root provider', () => {
    // The recommended host shape: a non-React shell called
    // configureTectonRoot() and every container mounts nested. Nothing here is
    // scope="root", and before the stand-in this page showed no toast at all.
    render(
      <>
        <TectonProvider scope="nested">
          <Raise payload={{body: 'from the first container'}} />
        </TectonProvider>
        <TectonProvider scope="nested">
          <Raise payload={{body: 'from the second container'}} />
        </TectonProvider>
      </>,
    );

    const [first, second] = screen.getAllByRole('button', {name: 'Raise'});
    fireEvent.click(first!);
    fireEvent.click(second!);

    // One viewport for the page, published by the first nested provider, and
    // both containers' toasts are in it.
    expect(toastNodes()).toHaveLength(2);
    expect(viewportOf('from the first container')).not.toBeNull();
    expect(viewportOf('from the second container')).toBe(
      viewportOf('from the first container'),
    );

    const [dismissFirst, dismissSecond] = screen.getAllByRole('button', {
      name: 'Dismiss',
    });
    fireEvent.click(dismissFirst!);
    fireEvent.click(dismissSecond!);
  });

  it('renders no viewport of its own once a root provider owns the page', () => {
    const page = render(
      <>
        <TectonProvider>
          <Raise payload={{body: 'from the shell'}} />
        </TectonProvider>
        <TectonProvider scope="nested">
          <Raise payload={{body: 'from a container with no viewport'}} />
        </TectonProvider>
      </>,
    );

    const [, container] = screen.getAllByRole('button', {name: 'Raise'});
    fireEvent.click(container!);

    // The nested provider renders nothing of its own: one publisher on the
    // page, the owning one, and the nested provider's standing offer to cover
    // for it is not being taken up.
    expect(toastNodes()).toHaveLength(1);
    expect(getToastBus()?.inspect?.()).toMatchObject({
      publishers: 1,
      owners: 1,
      standInRequests: 1,
      standingIn: false,
    });

    const [, dismissContainer] = screen.getAllByRole('button', {
      name: 'Dismiss',
    });
    fireEvent.click(dismissContainer!);
    page.unmount();
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

  it('hands the viewport over when a root provider mounts later', () => {
    // A page that starts in the all-nested shape: the first container stands
    // in, and its viewport is the page's.
    const container = render(
      <TectonProvider scope="nested">
        <Raise payload={{body: 'while standing in'}} />
      </TectonProvider>,
    );
    fireEvent.click(screen.getByRole('button', {name: 'Raise'}));
    expect(toastNodes()).toHaveLength(1);
    expect(getToastBus()?.inspect?.()).toMatchObject({standingIn: true});

    // A scope="root" provider turns up — a shell mounting its own tree, say.
    // The stand-in hands the page back: one publisher, the owning one.
    const shell = render(
      <TectonProvider>
        <Raise payload={{body: 'from the new owner'}} />
      </TectonProvider>,
    );
    expect(getToastBus()?.inspect?.()).toMatchObject({
      publishers: 1,
      owners: 1,
      standInRequests: 1,
      standingIn: false,
    });
    // The stand-in's viewport went with it, and the toast it was showing with
    // it: a viewport is a rendering surface, not a store.
    expect(toastNodes()).toHaveLength(0);

    // Toasts raised from either tree now land in the owner's one viewport.
    const [standIn, owner] = screen.getAllByRole('button', {name: 'Raise'});
    fireEvent.click(standIn!);
    fireEvent.click(owner!);
    expect(toastNodes()).toHaveLength(2);
    expect(viewportOf('from the new owner')).toBe(
      viewportOf('while standing in'),
    );

    shell.unmount();
    container.unmount();
  });
});
