import React from "react";
import useQuery from "./useQuery";
import Layout from "./Layout";
import LayoutMobile from "./LayoutMobile";

export default function ResponsiveLayoutProvider({ children }) {
  const isMobile = useQuery("(max-width: 768px)");

  const Layoutt = isMobile ? LayoutMobile : Layout;

  return <Layoutt>{children}</Layoutt>;
}
