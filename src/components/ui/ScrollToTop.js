import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  // الصفحات اللي محتاجين فيها scroll to top
  const scrollPaths = [
    "/", 
    "/externalprofile",
    "/internalprofile",
    "/supervision-info",
    "/thesesdetails",
  ];

  useEffect(() => {
    // حول المسار الحالي لصغير علشان يتطابق
    if (!scrollPaths.includes(location.pathname.toLowerCase())) return;

    // scroll للـ window بس
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // لو فيه containers عندك محتاج scroll
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (
        style.overflow === "auto" ||
        style.overflow === "scroll" ||
        style.overflowY === "auto" ||
        style.overflowY === "scroll"
      ) {
        el.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    });
  }, [location]);

  return null;
}