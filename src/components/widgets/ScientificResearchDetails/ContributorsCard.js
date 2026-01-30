export default function ContributorsCard({ title, contributors }) {
  return (
    <div className="bg-[#EDEDED] border border-[#19355a] rounded-[14px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] px-6 pt-6 pb-8 min-h-[360px] max-w-[365px] mt-6">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h4 className="text-2xl font-semibold text-center text-[#19355a] -translate-y-3">
            {title}
          </h4>
          <span className="block w-[145px] h-[5px] bg-[#b38e19] mx-auto mt-2 rounded-[5px]" />
        </div>

        <div className="flex justify-center mt-4">
          <ol className="list-decimal list-inside text-center space-y-3 text-lg font-bold">
            {contributors.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
