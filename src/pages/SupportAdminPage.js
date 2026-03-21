import React from "react";
import { Headset } from "lucide-react";

export default function SupportAdminPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#F9FAFB] text-center px-6">
      <div className="bg-[#19355A] text-white p-5 rounded-full mb-6 shadow-lg">
        <Headset size={60} strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold text-[#19355A] mb-4">
        Support Admin Page
      </h1>
      <p className="text-gray-500 text-lg max-w-md">
        This page is under construction. Support admin features will be
        available here soon.
      </p>
    </div>
  );
}
