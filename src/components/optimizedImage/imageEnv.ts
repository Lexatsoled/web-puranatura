export const loadBlurCss = () => {
  if (typeof window === 'undefined') return;
  import('react-lazy-load-image-component/src/effects/blur.css').catch(
    () => {}
  );
};
