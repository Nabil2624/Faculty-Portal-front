import { useState, useEffect } from "react";
import { fetchCV } from "../../../services/profile.service";

export default function CVPreview({ personalDataId, cvId }) {
  const [cvUrl, setCvUrl] = useState(null);

  useEffect(() => {
    const loadCV = async () => {
      try {
        const blob = await fetchCV(personalDataId, cvId);
        const url = URL.createObjectURL(blob);
        setCvUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    loadCV();
  }, [personalDataId, cvId]);

  if (!cvUrl) return <div className="p-4 text-center">Loading CV...</div>;

  return (
    <div className="relative group h-[500px] w-full bg-gray-200 rounded-lg overflow-hidden">
      {/* Preview */}
      <iframe
        src={cvUrl}
        className="w-full h-full object-cover"
        title="CV Preview"
      />

      {/* Overlay عند hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <button
          onClick={() => window.open(cvUrl, "_blank")}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#19355A] text-white px-6 py-3 rounded-xl font-bold"
        >
          View Full CV
        </button>
      </div>
    </div>
  );
}