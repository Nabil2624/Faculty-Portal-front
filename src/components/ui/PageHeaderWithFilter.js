import { Filter } from "lucide-react";

export default function PageHeaderWithFilter({ title, onFilter }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-base font-semibold lg:text-3xl text-black-600">
        {title}
        <span className="block w-12 h-1 bg-[#b38e19] mt-1 lg:w-16"></span>
      </h2>

      <div
        onClick={onFilter}
        className="w-8 h-8 border-2 border-[#b38e19] rounded-md flex items-center justify-center cursor-pointer lg:w-10 lg:h-10"
      >
        <Filter className="w-5 h-5 text-gray-700" />
      </div>
    </div>
  );
}
