export default function InfoRow({
  label,
  value,
  labelWidth = "w-32", // default width for the label
  valueWidth = "w-60", // default width for the grey box
}) {
  return (
    <div className="flex h-[40px] rounded-md overflow-hidden text-sm">
      {/* Label */}
      <div
        className={`bg-[#19355a] text-white ${labelWidth} flex items-center justify-center px-2 text-center`}
      >
        {label}
      </div>

      {/* Value */}
      <div
        className={`bg-[#E2E2E2] text-black ${valueWidth} flex items-center justify-center px-2 text-center rounded-[5px]`}
      >
        {value || "-"}
      </div>
    </div>
  );
}
