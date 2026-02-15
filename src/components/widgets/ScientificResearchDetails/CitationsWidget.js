import CitationsChart from "./CitationsChart";

export default function CitationsWidget({ data = [], title }) {
  return <CitationsChart data={data} title={title} />;
}
