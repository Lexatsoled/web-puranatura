export const focusManagement = {
  focusNext: (currentElement: HTMLElement) => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).indexOf(currentElement);
    const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
    if (nextElement) {
      nextElement.focus();
      return true;
    }
    return false;
  },
  focusPrevious: (currentElement: HTMLElement) => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).indexOf(currentElement);
    const prevElement = focusableElements[currentIndex - 1] as HTMLElement;
    if (prevElement) {
      prevElement.focus();
      return true;
    }
    return false;
  },
  focusFirstInContainer: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
      return true;
    }
    return false;
  },
  focusLastInContainer: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastElement) {
      lastElement.focus();
      return true;
    }
    return false;
  },
  isFocusable: (element: HTMLElement) => {
    return (
      element.matches(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) && !element.hasAttribute('disabled')
    );
  },
  getFocusableElements: (container: HTMLElement = document.body) => {
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled')) as HTMLElement[];
  },
};

export default focusManagement;

