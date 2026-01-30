export default function InfoRow({ label, value }) {
  return (
    <div className="flex h-[40px] rounded-md overflow-hidden text-sm">
      <div className="bg-[#19355a] text-white w-32 flex items-center justify-center px-2 text-center">
        {label}
      </div>

      <div
        className="bg-[#E2E2E2] text-black w-60 flex items-center justify-center px-2 text-center rounded-[5px] 
"
      >
        {value || "-"}
      </div>
    </div>
  );
}
