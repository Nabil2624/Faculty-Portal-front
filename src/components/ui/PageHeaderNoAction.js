export default function PageHeaderNoAction({ title }) {
  return (
    <div className="mb-12 max-w-[1500px] -mx-15">
      <h2 className="text-xl sm:text-3xl font-semibold text-black">
        {title}
        <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
      </h2>
    </div>
  );
}
