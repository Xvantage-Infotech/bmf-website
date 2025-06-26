import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [screenWidth, setScreenWidth] = useState(0);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return {
    isMobile: screenWidth < 768,
    isTablet: screenWidth >= 768 && screenWidth < 1024,
    isDesktop: screenWidth >= 1024,
    screenWidth,
  };
};

export const useBreakpoint = (breakpoint) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const breakpoints = {
        sm: '(min-width: 640px)',
        md: '(min-width: 768px)',
        lg: '(min-width: 1024px)',
        xl: '(min-width: 1280px)',
      };

      const mediaQuery = window.matchMedia(breakpoints[breakpoint] || breakpoints.md);
      setMatches(mediaQuery.matches);

      const handleChange = (e) => {
        setMatches(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [breakpoint]);

  return matches;
};