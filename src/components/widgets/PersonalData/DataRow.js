import React from "react";

export default function DataRow({ left, right, isSocial, emptyText }) {
  const isURL = (value) => {
    try { new URL(value); return true; }
    catch { return false; }
  };
  const getDomain = (url) => {
    if (!url) return "";
    try { return new URL(url).hostname.replace("www.", ""); }
    catch { return url; }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b last:border-0"
         style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
      <div className="px-4 py-3 font-semibold bg-gray-200">{left?.label || ""}</div>
      <div
        className={`px-4 py-3 ${isSocial ? "cursor-pointer text-black" : ""}`}
        onClick={() => isSocial && left?.value && isURL(left.value) && window.open(left.value, "_blank")}
      >
        {isSocial ? (left?.value ? getDomain(left.value) : emptyText) : left?.value || emptyText}
      </div>

      <div className="px-4 py-3 font-semibold bg-gray-200">{right?.label || ""}</div>
      <div
        className={`px-4 py-3 ${isSocial ? "cursor-pointer text-black" : ""}`}
        onClick={() => isSocial && right?.value && isURL(right.value) && window.open(right.value, "_blank")}
      >
        {isSocial ? (right?.value ? getDomain(right.value) : emptyText) : right?.value || emptyText}
      </div>
    </div>
  );
}