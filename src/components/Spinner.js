import React from "react";
import Logo from "./Logo";
import NormalSpinner from "./NormalSpinner";

export default function Spinner() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full"
      style={{ backgroundColor: "#19355a" }} // dark blue background
    >
      {/* Spinner + Logo */}
      <div className="relative flex items-center justify-center">
        <NormalSpinner
          width="w-56"
          height="h-56"
          borderColor="border-gray-300"
          borderTopColor="border-t-[#B38E19]" // ✅ gold spinner color
        />
        <Logo width="w-36" height="h-36" />
      </div>
    </div>
  );
}
