export default function InputFieldArea({
  label,
  placeholder,
  required,
  value,
  onChange,
  setValue, // 👈 support old usage
  error,
  className = "",
  disabled = false,
}) {
  const inputClass =
    "w-full h-[40px] bg-[#E2E2E2] rounded-md px-3 text-[12px] outline-none text-gray-800 placeholder:text-gray-600 mt-2";

  const handleChange = (e) => {
    if (onChange) onChange(e);
    else if (setValue) setValue(e.target.value);
  };

  return (
    <div>
      <label className="block mb-2 font-medium text-lg">
        {label} {required && <span className="text-[#B38E19]">*</span>}
      </label>

      <input
        className={`${inputClass} ${
          error ? "border border-red-500" : ""
        } ${className}`}
        placeholder={placeholder}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
