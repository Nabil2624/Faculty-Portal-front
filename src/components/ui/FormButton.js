import React from "react";


export default function FormButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
  className = "",
}) {
  const base = `
    font-medium transition active:scale-95
    rounded-[clamp(0.2rem,0.4vw,0.7rem)]
    px-[clamp(14px,2.9vw,100px)]
    py-[clamp(6px,0.6vw,40px)]   
    text-[clamp(12px,1vw,50px)]
    ${fullWidth ? "w-full" : ""}
  `;

  const variants = {
    primary: "bg-[#b38e19] text-white hover:opacity-90",
    secondary: "bg-gray-300 text-black hover:opacity-90",
    danger: "bg-red-500 text-white hover:opacity-90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
