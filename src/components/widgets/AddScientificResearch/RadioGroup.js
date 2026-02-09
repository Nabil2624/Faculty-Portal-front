export default function RadioGroup({ label, options, name }) {
  return (
    <div>
      <label className="block mb-3 font-medium text-lg">{label}</label>
      <div className="flex gap-4 text-sm text-gray-600 justify-start">
        {options.map((option, i) => (
          <label key={i} className="flex items-center gap-2">
            <input type="radio" name={name} className="accent-[#B38E19]" />{" "}
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
