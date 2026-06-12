export function RadioCard({ label, name, ...rest }) {
  return (
    <label className="flex items-center gap-2 p-3 bg-white rounded-[clamp(6px,0.6vw,10px)] border border-slate-200 cursor-pointer hover:bg-gray-50 transition shadow-sm select-none">
      <input type="radio" name={name} className="text-[#b38e19] focus:ring-[#b38e19]/30 h-4 w-4 accent-[#b38e19]" {...rest} />
      <span className="text-[clamp(0.8rem,1vw,1.1rem)] font-medium text-slate-800">{label}</span>
    </label>
  );
}