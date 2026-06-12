export function CheckboxCard({ label, ...rest }) {
  return (
    <label className="flex items-center gap-2 p-3 bg-white rounded-[clamp(6px,0.6vw,10px)] border border-slate-200 cursor-pointer hover:bg-gray-50 transition shadow-sm select-none">
      <input type="checkbox" className="rounded text-[#19355a] focus:ring-[#19355a]/30 h-4 w-4 accent-[#19355a]" {...rest} />
      <span className="text-[clamp(0.8rem,1vw,1.1rem)] font-medium text-slate-800">{label}</span>
    </label>
  );
}