import React from "react";
import myImage from "../images/bob.png"; // replace with your image

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <img
        src={myImage}
        alt="Loading..."
        className="w-26 h-26 animate-spin"
      />
    </div>
  );
}
