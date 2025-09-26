import { DEFAULT_PROCESS_DURATION } from '@/constants';
import { useEffect, useState } from 'react';

interface WindowDimensions {
  width?: number;
  height?: number;
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowDimensions;
}

export function useSetTimeout(cb: () => void, delay = DEFAULT_PROCESS_DURATION) {
  return useEffect(() => {
    const timeout = setTimeout(cb, delay);
    return () => clearTimeout(timeout);
  }, [cb, delay]);
}
