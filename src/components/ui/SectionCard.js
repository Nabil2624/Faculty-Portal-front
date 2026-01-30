export default function SectionCard({ title, children }) {
  return (
    <div className="bg-[#EDEDED] border border-[#19355a] rounded-[14px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] px-6 pt-6 pb-8 min-h-[360px] max-w-[365px] mt-6">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h4 className="text-2xl font-semibold text-center text-[#19355a] -translate-y-3">
            {title}
          </h4>
          <span className="block w-[145px] h-[5px] bg-[#b38e19] mx-auto mt-2 rounded-[5px]"></span>
        </div>

        <div className="flex-1 flex justify-center pt-4">{children}</div>
      </div>
    </div>
  );
}
