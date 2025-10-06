import React from "react";
import myImage from "../images/helwanload.png"; // replace with your image

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100  ">
      <img
        src={myImage}
        alt="Loading..."
        className="w-25 h-24 animate-spin-zoom-pulse "
      />

    </div>
  );
}
