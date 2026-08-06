import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

export const useScrollAnimation = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerOptions = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...(options || {}) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      }, observerOptions);

      const node = ref.current;
      if (node) observer.observe(node);

      return () => {
        if (node) observer.unobserve(node);
        observer.disconnect();
      };
    },
    [observerOptions]
  );

  return [ref, isVisible];
};
