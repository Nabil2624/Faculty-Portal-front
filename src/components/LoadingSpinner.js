import React from "react";
import myImage from "../images/icons8-loading-50.png"; // replace with your image

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <img
        src={myImage}
        alt="Loading..."
        className="w-25 h-24 animate-spin-zoom-continuous"
      />
    </div>
  );
}
