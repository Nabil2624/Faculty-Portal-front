import { Pencil, Trash2 } from "lucide-react";

export default function ProjectCard({ project, isArabic, onDelete, onDetails, onEditNavigate }) {
  return (
    <article
      onClick={() => onDetails(project)}
      className={`relative bg-gray-100 rounded-[12px] shadow-md p-3 border-[4px] border-[#19355a] cursor-pointer ${
        isArabic ? "border-r-[19px]" : "border-l-[19px]"
      }`}
      role="button"
      tabIndex={0}
    >
      {/* Actions */}
      <div
        className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} flex gap-3`}
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          className="text-[#b38e19] cursor-pointer w-5 h-5 hover:text-[#d1a82c] hover:scale-110 transition"
          onClick={() => onEditNavigate(project)}
        />
        <Trash2
          className="text-[#E53935] w-5 h-5 cursor-pointer hover:text-[#e45552] hover:scale-110 transition"
          onClick={() => onDelete(project)}
        />
      </div>

      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black mb-1 break-words">
        {project.nameOfProject}
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-black">
        {project.startDate} - {project.endDate}
      </p>
      <p className="text-xs sm:text-sm md:text-base text-black">
        {isArabic ? project.typeOfProject?.valueAr : project.typeOfProject?.valueEn}
      </p>
    </article>
  );
}
