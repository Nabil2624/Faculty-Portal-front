export default function InputField({
  label,
  placeholder,
  required,
  value,
  onChange,
  error,
  className = "",
}) {
  const inputClass =
    "w-full h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600 mt-2";

  return (
    <div>
      <label className="block mb-2 font-medium text-lg">
        {label} {required && <span className="text-[#B38E19]">*</span>}
      </label>
      <input
        className={`${inputClass} ${error ? "border border-red-500" : ""} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
