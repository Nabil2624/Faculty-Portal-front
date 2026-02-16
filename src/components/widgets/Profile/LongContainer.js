import ProfileSections from "../widgets/Profile/ProfileSections";

export default function BottomRow({ experience, education, cv }) {
  return (
    <div className="flex flex-1 gap-4">
      <div className="bg-white shadow-md rounded-lg p-4 flex-1">مستطيل طرفي</div>
      <div className="bg-white shadow-md rounded-lg p-4 flex-1">
        <ProfileSections experience={experience} education={education} cv={cv} />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 flex-1">مستطيل طرفي أيمن</div>
    </div>
  );
}
