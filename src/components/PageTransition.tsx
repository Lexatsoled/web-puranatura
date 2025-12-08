import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.transition = `opacity 400ms ${ease}, transform 400ms ${ease}`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => {
      if (el) el.style.transition = '';
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-full"
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
