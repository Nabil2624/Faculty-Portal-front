import { useEffect, useState } from "react";

export default function useBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
