import SectionCard from "../../ui/SectionCard";

export default function ContributorsWidget({ contributors, title }) {
  return (
    <SectionCard title={title}>
      <ol
        dir="ltr"
        className="list-decimal list-inside text-center space-y-4 text-lg font-bold"
      >
        {contributors.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ol>
    </SectionCard>
  );
}
