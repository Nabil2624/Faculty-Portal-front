export default function PageHeaderDualAction({
  title,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-sm font-semibold lg:text-3xl text-black">
        {title}
        <span className="block w-16 h-1 bg-[#b38e19] mt-1 lg:w-32"></span>
      </h2>

      <div className="flex gap-2 lg:gap-4">
        <button
          onClick={onPrimary}
          className="
            bg-[#b38e19] text-white
            px-3 py-1 text-xs
            lg:px-6 lg:py-2 lg:text-sm
            rounded-[5px] font-medium
            hover:bg-[#a07f16] transition
          "
        >
          {primaryLabel}
        </button>

        <button
          onClick={onSecondary}
          className="
            border border-[#b38e19] bg-[#b38e19] text-white
            px-3 py-1 text-xs
            lg:px-6 lg:py-2 lg:text-sm
            rounded-[5px] font-medium
            hover:bg-[#a07f16] transition
          "
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
