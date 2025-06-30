"use client";


import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
  };
};

export const useBreakpoint = (breakpoint) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    };

    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);

    const handleChange = (e) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches); // Initial state
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
};
