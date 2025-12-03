import { RefObject } from 'react';
import { getFocusables, handleTabNavigation } from './focus/tabNavigation';

type GetFocusable = () => HTMLElement[];

export const focusInitial = (
  getFocusable: GetFocusable,
  initialFocusRef?: RefObject<HTMLElement | null>
) => {
  const focusables = getFocusables(getFocusable);
  const preferred = initialFocusRef?.current ?? focusables[0];
  preferred?.focus();
};

export const createKeydownHandler = (
  getFocusable: GetFocusable,
  root: HTMLElement,
  onEscape?: () => void
) => {
  const resolveFocusables = () => getFocusables(getFocusable);

  return (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape?.();
      return;
    }
    if (event.key === 'Tab') {
      handleTabNavigation(event, resolveFocusables(), root);
    }
  };
};
