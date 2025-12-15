export const loadBlurCss = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') return;
  import('react-lazy-load-image-component/src/effects/blur.css').catch(
    () => {}
  );
};
