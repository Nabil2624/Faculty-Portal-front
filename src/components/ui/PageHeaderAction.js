export default function PageHeaderAction({ title, actionLabel, onClick }) {
  return (
    <div className="flex justify-between items-center mb-12 max-w-[1500px] -mx-15">
      <h2 className="text-xl sm:text-3xl font-semibold text-black">
        {title}
        <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
      </h2>

      <button
        onClick={onClick}
        className="bg-[#b38e19] text-white px-7 py-2 rounded-[5px] text-sm font-medium hover:bg-[#a07f16] transition"
      >
        {actionLabel}
      </button>
    </div>
  );
}
