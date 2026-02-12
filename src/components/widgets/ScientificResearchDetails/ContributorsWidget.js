import SectionCard from "../../ui/SectionCard";

export default function ContributorsWidget({ contributors = [], title }) {
  return (
    <SectionCard title={title}>
      <ol dir="ltr" className="text-center space-y-4 text-lg font-bold">
        {contributors.map((c, i) => {
          const isFirst = i === 0;

          return (
            <li key={i} className="flex justify-center gap-2">
              <span className={isFirst ? "text-[#B38E19]" : "text-gray-800"}>
                {i + 1}.
              </span>

              <span className={isFirst ? "text-[#B38E19]" : "text-gray-800"}>
                {c}
              </span>
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}
