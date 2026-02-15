export default function RadioGroup({ label, options, name, value, onChange }) {
  return (
    <div>
      <label className="block mb-3 font-medium text-lg">{label}</label>

      <div className="flex gap-4 text-sm text-gray-600 justify-start">
        {options.map((option, i) => (
          <label key={i} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)} // SAFE
              className="accent-[#B38E19]"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
