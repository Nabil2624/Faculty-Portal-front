import { useState, useRef, useEffect } from "react";

export default function useSearchInput() {
  const [showSearch, setShowSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }
    if (showSearch)
      document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  return {
    showSearch,
    setShowSearch,
    isFocused,
    setIsFocused,
    searchRef,
    inputRef,
  };
}