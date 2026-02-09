import { Search } from "lucide-react";

export default function DOIInput({
  placeholder,
  value,
  setValue,
  onSearch,
  error,
}) {
  return (
    <div className="mb-1">
      <label className="block mb-2 font-medium text-lg">
        DOI <span className="text-[#B38E19]">*</span>
      </label>
      <div className="flex gap-2 flex-row-reverse">
        <button
          type="button"
          onClick={() => onSearch(value)}
          className="w-[40px] h-[40px] bg-[#B38E19] rounded-md flex items-center justify-center"
        >
          <Search size={18} className="text-white" />
        </button>

        <input
          type="text"
          className={`flex-1 h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none placeholder:text-gray-600 border ${
            error ? "border-red-500" : "border-[#B38E19]"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}{" "}
    </div>
  );
}
