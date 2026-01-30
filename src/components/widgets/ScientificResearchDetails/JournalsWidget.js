import SectionCard from "../../ui/SectionCard";

export default function JournalsWidget({ journals, title }) {
  return (
    <SectionCard title={title}>
      <ol
        dir="ltr"
        className="list-decimal list-inside text-center space-y-3 text-lg font-black"
      >
        {journals.map((j, i) => (
          <li key={i}>{j}</li>
        ))}
      </ol>
    </SectionCard>
  );
}
