export default function HalfSectionCard({ title, children }) {
  return (
    <div
      className="bg-[#EDEDED] border border-[#19355a] rounded-[14px] 
                    shadow-[0_4px_10px_rgba(0,0,0,0.08)] 
                    px-6 pt-6 pb-6 
                    min-h-[170px] max-w-[365px] mt-6"
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h4 className="text-xl font-semibold text-center text-[#19355a] -translate-y-2">
            {title}
          </h4>
          <span className="block w-[100px] h-[4px] bg-[#b38e19] mx-auto mt-2 rounded-[5px]" />
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
