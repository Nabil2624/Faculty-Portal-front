import React from "react";
import useQuery from "./useQuery";
import Layout from "./Layout";
import LayoutMobile from "./LayoutMobile";
import LargeLayout from "./LargeLayout"; // استيراد ال Layout الكبير

export default function ResponsiveLayoutProvider({ children }) {
  const isMobile = useQuery("(max-width: 768px)"); // موبايل
  const isLargeScreen = useQuery("(min-width: 1920px)"); // 3XL وما فوق
  let Layoutt;

  if (isMobile) {
    Layoutt = LayoutMobile;
  }else {
    Layoutt = Layout; // الشاشات المتوسطة
  }

  return <Layoutt>{children}</Layoutt>;
}
