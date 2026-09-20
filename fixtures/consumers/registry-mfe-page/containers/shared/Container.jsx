/**
 * One micro-frontend container.
 *
 * Both containers render this file, and each is bundled against its own
 * registry-installed copy of `@tecton/react` — and therefore its own copy of
 * everything underneath it, and its own React. Nothing is shared between the
 * two bundles, which is exactly the micro-frontend situation.
 *
 * Nothing here imports anything but `@tecton/react`: a container is an
 * ordinary consumer, and a consumer never sees what Tecton is built on. What
 * it does see is the component system's own API, themed by Tecton.
 *
 * The dialog and the menu are controlled and driven from the imperative
 * handle, because a modal from container A covers container B's buttons — a
 * real page's problem, but not one a check should have to click through.
 */
import {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {
  Banner,
  Button,
  Card,
  Dialog,
  DialogHeader,
  DropdownMenu,
  Heading,
  TectonProvider,
  Text,
  VStack,
  useToast,
} from '@tecton/react';

/** Hands this container's `useToast` out to the imperative handle. */
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
              @tecton/react {version} · scope={scope}
            </Text>
            <Text data-testid={`${id}-probe`} type="supporting">
              token probe
            </Text>
            {/*
              The banner the styling checks read for a per-component decision:
              on `container="card"` the theme hands the banner its own corner
              radius, so the banner's computed `border-radius` is a Tecton
              decision rather than an upstream default.
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
            <DropdownMenu
              data-testid={`${id}-menu`}
              button={{label: `${upper} menu`}}
              isMenuOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              items={[{label: `Rename ${upper}`, onClick: () => {}}]}
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
          <Text data-testid={`${id}-dialog-body`}>
            A modal from container {upper}.
          </Text>
        </Dialog>
      </div>
    </TectonProvider>
  );
}
