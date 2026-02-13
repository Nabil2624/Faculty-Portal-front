// export default function TextareaField({
//   label,
//   placeholder,
//   required,
//   height,
//   value, // <-- controlled
//   onChange, // <-- controlled
//   className = "",
//   isAbstract = false,
//   error,
//   disabled = false,
// }) {
//   // Determine typing direction dynamically for abstract only
//   const isArabic = isAbstract && /[\u0600-\u06FF]/.test(value || "");

//   return (
//     <div className="relative w-full">
//       <label className="block mb-4 font-medium text-lg">
//         {label} {required && <span className="text-[#B38E19]">*</span>}
//       </label>

//       {isAbstract ? (
//         <div className={`relative w-full ${height}`}>
//           <textarea
//             value={value}
//             onChange={(e) => onChange && onChange(e.target.value)}
//             className={`
//               w-full h-full
//               bg-[#E2E2E2]
//               rounded-md
//               resize-none
//               outline-none
//               text-[12px]
//               px-3
//               pt-6 pb-2
//               border ${error ? "border-red-500" : "border"}
//               ${className}
//               ${isArabic ? "text-right" : "text-left"}
//             `}
//             dir={isArabic ? "rtl" : "ltr"}
//             placeholder=""
//           />

//           {!value && placeholder && (
//             <div
//               className={`
//                 absolute inset-0 flex items-center justify-center
//                 text-gray-600 text-[12px]
//                 pointer-events-none
//                 px-3
//                 text-center
//                 whitespace-pre-wrap
//               `}
//             >
//               {placeholder}
//             </div>
//           )}
//         </div>
//       ) : (
//         <textarea
//           value={value}
//           disabled={disabled}
//           onChange={onChange}
//           className={`
//             w-full ${height}
//             ${disabled ? "bg-[#A8A8A8]" : "bg-[#E2E2E2]"}
//             rounded-md
//             resize-none
//             outline-none
//             text-[12px]
//             px-3 py-4 pt-20 pr-7
//             placeholder:text-gray-600
//             text-center
//             border ${error ? "border-red-500" : "border"}
//             ${className}
//           `}
//           placeholder={placeholder}
//         />
//       )}

//       {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//     </div>
//   );
// }

export default function TextareaField({
  label,
  placeholder,
  required,
  height,
  value, // controlled
  onChange, // controlled
  className = "",
  isAbstract = false,
  error,
  disabled = false,
}) {
  // Determine typing direction dynamically for abstract only
  const isArabic = isAbstract && /[\u0600-\u06FF]/.test(value || "");

  const handleChange = (e) => {
    if (!onChange) return;
    // For abstract we already pass the value
    if (isAbstract) onChange(e.target.value);
    else onChange(e.target.value); // <-- fixed here
  };

  return (
    <div className="relative w-full">
      <label className="block mb-4 font-medium text-lg">
        {label} {required && <span className="text-[#B38E19]">*</span>}
      </label>

      {isAbstract ? (
        <div className={`relative w-full ${height}`}>
          <textarea
            value={value}
            onChange={handleChange}
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
            dir={isArabic ? "rtl" : "ltr"}
            placeholder=""
          />
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
        <textarea
          value={value}
          disabled={disabled}
          onChange={handleChange}
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

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
