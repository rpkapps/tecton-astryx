/**
 * One micro-frontend container.
 *
 * Both containers render this same source, but each is bundled separately
 * against its own copy of `@tecton/react` — and therefore its own copy of
 * everything underneath it, and its own React. No module instance is shared
 * between them, which is exactly the micro-frontend situation.
 *
 * Nothing here imports anything but `@tecton/react`: a container is an
 * ordinary consumer, and a consumer never sees what Tecton is built on.
 *
 * Beside the panel the styling assertions read, each container can open the
 * three things that used to fight across containers: a modal dialog (which
 * pins the body), a menu (a dismissible layer, opened over everything else),
 * and a toast (which needs a viewport to land in).
 *
 * The dialog and the menu are **controlled**, and the container exposes
 * open/close on its imperative handle, because a modal from container A
 * covers container B's buttons — a real page's problem, but not one a test
 * should have to click its way through. The toast buttons stay ordinary
 * clicks: nothing covers them.
 */
import {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {
  TectonProvider,
  Button,
  Dialog,
  Menu,
  Panel,
  useToast,
} from '@tecton/react';

/**
 * Hands this container's `useToast` back out to the imperative handle.
 *
 * It has to be rendered inside the provider, which is the point: the toast is
 * raised by *this* container's copy of Tecton, wherever the page ends up
 * showing it.
 */
function ToastBinding({toastRef}) {
  const toast = useToast();
  useEffect(() => {
    toastRef.current = toast;
    return () => {
      toastRef.current = null;
    };
  }, [toast, toastRef]);
  return null;
}

export function Container({id, version, mode, scope, handleRef}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toastRef = useRef(null);
  const upper = id.toUpperCase();

  useImperativeHandle(
    handleRef,
    () => ({
      id,
      version,
      openDialog: () => setIsDialogOpen(true),
      closeDialog: () => setIsDialogOpen(false),
      openMenu: () => setIsMenuOpen(true),
      closeMenu: () => setIsMenuOpen(false),
      raiseToast: body =>
        toastRef.current?.({body: body ?? `toast from container ${id}`}),
    }),
    [id, version],
  );

  return (
    <TectonProvider mode={mode} scope={scope}>
      <ToastBinding toastRef={toastRef} />
      <div data-container={id} data-version={version}>
        <Panel
          data-testid={`${id}-panel`}
          title={`Container ${upper}`}
          description={`@tecton/react ${version} · mode=${mode} · scope=${scope}`}
        >
          <p data-testid={`${id}-probe-body`}>token probe</p>
          <Button
            data-testid={`${id}-btn-primary`}
            variant="primary"
            label="Primary"
          />
          <Button
            data-testid={`${id}-open-dialog`}
            variant="secondary"
            label={`Open ${upper} dialog`}
            onClick={() => setIsDialogOpen(true)}
          />
          <Menu
            data-testid={`${id}-menu`}
            label={`${upper} menu`}
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            items={[
              {label: `Rename ${upper}`, onSelect: () => {}},
              {label: `Duplicate ${upper}`, onSelect: () => {}},
            ]}
          />
          <Button
            data-testid={`${id}-raise-toast`}
            variant="tertiary"
            label={`Toast from ${upper}`}
            onClick={() =>
              toastRef.current?.({body: `toast from container ${id}`})
            }
          />
        </Panel>

        <Dialog
          data-testid={`${id}-dialog`}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={`Dialog ${upper}`}
          footer={
            <Button
              data-testid={`${id}-dialog-close`}
              variant="secondary"
              label="Close"
              onClick={() => setIsDialogOpen(false)}
            />
          }
        >
          <p data-testid={`${id}-dialog-body`}>
            A modal from container {upper}.
          </p>
        </Dialog>
      </div>
    </TectonProvider>
  );
}
