import { useState, useEffect } from "react";

/**
 * Custom hook to detect if a CSS media query matches.
 * @param {string} query - Media query string, e.g., "(max-width: 768px)"
 * @returns {boolean} - true if the query matches, false otherwise
 */
export default function useQuery(query) {
  // Initialize state with current match
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    // Add listener for changes
    media.addListener(listener);

    // Cleanup
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
}
