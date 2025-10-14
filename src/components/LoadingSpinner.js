import React from "react";
import NormalSpinner from "./NormalSpinner";
import logo from "../images/helwan-logooo.png";       
import nucleus from "../images/nuc.png"; 

export default function LoadingSpinner() {
    return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#19355a]">
      <div className="relative flex items-center justify-center w-64 h-64">
        
        {/* Static NormalSpinner behind the logo */}
        <NormalSpinner
          width="w-[220px]"
          height="h-[220px]"
          borderColor="border-gray-300"
          borderTopColor="border-t-[#B38E19]" 
        />
        
        {/* Logo + Nucleus في نفس الـdiv */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Full logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-50 h-50"
          />
          
          {/* Spinning nucleus (مكانها وستايلها متغيرش) */}
          <img
            src={nucleus}
            alt="Nucleus"
            className="absolute bottom-[35%] right-[0.5%] animate-spin-reverse"
          />
        </div>
      </div>
    </div>
  );
}
