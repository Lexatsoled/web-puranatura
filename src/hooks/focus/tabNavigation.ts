type GetFocusable = () => HTMLElement[];

const focusFirst = (focusables: HTMLElement[]) => focusables[0]?.focus();
const focusLast = (focusables: HTMLElement[]) =>
  focusables[focusables.length - 1]?.focus();

const shouldCycleBackward = (
  current: Element | null,
  first: HTMLElement,
  root: HTMLElement
) => current === first || !root.contains(current);

export const handleTabNavigation = (
  event: KeyboardEvent,
  focusables: HTMLElement[],
  root: HTMLElement
) => {
  if (focusables.length === 0) {
    event.preventDefault();
    return;
  }

  const current = document.activeElement;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && shouldCycleBackward(current, first, root)) {
    event.preventDefault();
    focusLast(focusables);
    return;
  }

  if (!event.shiftKey && current === last) {
    event.preventDefault();
    focusFirst(focusables);
  }
};

export const getFocusables = (getter: GetFocusable) => getter();
