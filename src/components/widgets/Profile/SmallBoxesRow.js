export default function SmallBoxesRow({ count = 5 }) {
  return (
    <div className="grid grid-cols-5 gap-3 flex-1">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white shadow-md rounded-lg flex items-center justify-center h-full"
        >
          مربع {idx + 1}
        </div>
      ))}
    </div>
  );
}
