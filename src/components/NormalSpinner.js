import React from "react";

export default function NormalSpinner({
  borderSize = "border-4",
  width = "w-20",
  height = "h-20",
  borderColor = "border-gray-300",
  borderTopColor = "border-t-[#B38E19]", // default gold top
}) {
  return (
    <div
      className={`absolute ${width} ${height} ${borderSize} ${borderColor} rounded-full animate-spin ${borderTopColor}`}
    ></div>
  );
}
