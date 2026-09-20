/**
 * One micro-frontend container.
 *
 * Both containers render this same source, but each is bundled separately
 * against its own copy of `@tecton/react` — and therefore its own copy of
 * everything underneath it, and its own React. No module instance is shared
 * between them, which is exactly the micro-frontend situation.
 *
 * Nothing here imports anything but `@tecton/react`: a container is an
 * ordinary consumer, and a consumer never sees what Tecton is built on. What
 * it does see is the component system's own API — `Card`, `Banner`, `Button`,
 * `DropdownMenu`, `Dialog`, `useToast` — themed by Tecton.
 *
 * Beside the card and the banner the styling assertions read, each container
 * can open the three things that used to fight across containers: a modal
 * dialog (which pins the body), a menu (a dismissible layer, opened over
 * everything else), and a toast (which needs a viewport to land in).
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
  Banner,
  Button,
  Card,
  Dialog,
  DialogHeader,
  DropdownMenu,
  Heading,
  Text,
  VStack,
  useToast,
} from '@tecton/react';

/**
 * Hands this container's `useToast` back out to the imperative handle.
 *
 * It has to be rendered inside the provider, which is the point: the toast is
 * raised by *this* container's copy of Tecton, and lands in the viewport its
 * own provider mounts.
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
        <Card data-testid={`${id}-panel`}>
          <VStack gap={3}>
            <Heading level={2}>Container {upper}</Heading>
            <Text type="supporting">
              @tecton/react {version} · mode={mode} · scope={scope}
            </Text>
            <p data-testid={`${id}-probe-body`}>token probe</p>
            {/*
              The banner the styling assertions read for a per-component
              decision: on `container="card"` the theme hands the banner its
              own corner radius, so the banner's computed `border-radius` is a
              Tecton decision rather than an upstream default — measured beside
              the accent, and resolved the same way.
            */}
            <Banner
              data-testid={`${id}-banner`}
              status="info"
              container="card"
              title={`Banner ${upper}`}
            />
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
            <DropdownMenu
              data-testid={`${id}-menu`}
              button={{label: `${upper} menu`}}
              isMenuOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              items={[
                {label: `Rename ${upper}`, onClick: () => {}},
                {label: `Duplicate ${upper}`, onClick: () => {}},
              ]}
            />
            <Button
              data-testid={`${id}-raise-toast`}
              variant="ghost"
              label={`Toast from ${upper}`}
              onClick={() =>
                toastRef.current?.({body: `toast from container ${id}`})
              }
            />
          </VStack>
        </Card>

        <Dialog
          data-testid={`${id}-dialog`}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogHeader title={`Dialog ${upper}`} />
          <p data-testid={`${id}-dialog-body`}>
            A modal from container {upper}.
          </p>
          <Button
            data-testid={`${id}-dialog-close`}
            variant="secondary"
            label="Close"
            onClick={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>
    </TectonProvider>
  );
}
