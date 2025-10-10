import React from "react";
import helwanLogo from "../images/helwan-logo.png"; // ✅ your local image

export default function Logo({
  width = "w-32",
  height = "h-auto",
  bgColor = "",
}) {
  return (
    <div className={`flex justify-center items-center ${bgColor}`}>
      <img
        src={helwanLogo}
        alt="Helwan University Logo"
        className={`${width} ${height} object-contain rounded-lg shadow-md`}
      />
    </div>
  );
}
