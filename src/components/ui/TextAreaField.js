export default function TextareaField({
  label,
  placeholder,
  required,
  height,
  value,
  setValue,
  className = "",
  isAbstract = false,
  error,
  disabled = false, // disable the text area field
}) {
  // Determine typing direction dynamically for abstract only
  const isArabic = isAbstract && /[\u0600-\u06FF]/.test(value);

  return (
    <div className="relative w-full">
      <label className="block mb-4 font-medium text-lg">
        {label} {required && <span className="text-[#B38E19]">*</span>}
      </label>

      {isAbstract ? (
        // Abstract textarea with centered placeholder
        <div className={`relative w-full ${height}`}>
          <textarea
            value={value}
            onChange={(e) => setValue && setValue(e.target.value)}
            className={`
              w-full h-full
              bg-[#E2E2E2]
              rounded-md
              resize-none
              outline-none
              text-[12px]
              px-3
              pt-6 pb-2
              border ${error ? "border-red-500" : "border"}
              ${className}
              ${isArabic ? "text-right" : "text-left"}
            `}
            dir={isArabic ? "rtl" : "ltr"} // dynamic typing direction
            placeholder="" // leave blank, we’ll overlay
          />

          {/* Vertically centered placeholder */}
          {!value && placeholder && (
            <div
              className={`
                absolute inset-0 flex items-center justify-center
                text-gray-600 text-[12px]
                pointer-events-none
                px-3
                text-center
                whitespace-pre-wrap
              `}
            >
              {placeholder}
            </div>
          )}
        </div>
      ) : (
        // Regular textarea
        <textarea
          value={value}
          disabled={disabled}
          onChange={(e) => !disabled && setValue && setValue(e.target.value)}
          className={`
    w-full ${height}
    ${disabled ? "bg-[#A8A8A8]" : "bg-[#E2E2E2]"}
    rounded-md
    resize-none
    outline-none
    text-[12px]
    px-3 py-4 pt-20 pr-7
    placeholder:text-gray-600
    text-center
    border ${error ? "border-red-500" : "border"}
    ${className}
  `}
          placeholder={placeholder}
        />
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
