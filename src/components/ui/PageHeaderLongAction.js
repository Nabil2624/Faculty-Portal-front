import React from "react";

export default function PageHeaderLongAction({ title, actionLabel, onAction }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-base font-semibold lg:text-3xl text-black-600">
        {title}
        <span className="block w-20 h-1 bg-[#b38e19] mt-1 lg:w-32"></span>
      </h2>

      <button
        onClick={onAction}
        className="bg-[#b38e19] text-white px-12 py-2 rounded-[5px] text-sm font-medium hover:bg-[#a07f16] transition ml-8"
      >
        {actionLabel}
      </button>
    </div>
  );
}
