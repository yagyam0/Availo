// hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a media query list object
    const media = window.matchMedia(query);
    
    // Set initial state
    setMatches(media.matches);

    // Handler for media query changes
    const handler = (event) => setMatches(event.matches);

    // Add listener for changes
    media.addEventListener('change', handler);

    // Cleanup listener on unmount
    return () => media.removeEventListener('change', handler);
  }, [query]); // Re-run if query changes

  return matches;
}