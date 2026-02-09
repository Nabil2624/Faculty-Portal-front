import { Info } from "lucide-react";

export default function AttachmentUploader({ label, note, buttonLabel }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-xl">{label}</label>
      <div className="flex items-center gap-2 text-[11px] text-[#B38E19] mb-4">
        <Info size={14} style={{ color: "#19355A" }} />
        <span>{note}</span>
      </div>
      <button className="bg-[#19355A] text-white w-[190px] h-[32px] rounded-md border-2 border-[#B38E19]/50 text-base">
        {buttonLabel}
      </button>
    </div>
  );
}
