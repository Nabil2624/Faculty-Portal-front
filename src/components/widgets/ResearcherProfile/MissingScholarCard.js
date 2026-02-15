import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function MissingScholarCard({ onSave }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [scholarLink, setScholarLink] = useState("");
  const [orcid, setOrcid] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!scholarLink.trim()) {
      setError(
        isArabic ? "رابط جوجل سكولار مطلوب" : "Google Scholar link is required",
      );
      return;
    }

    setError("");
    onSave({ scholarLink, orcid });
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="bg-[#F7F7F7] border border-[#B38E19] rounded-2xl shadow-md w-full max-w-2xl p-10">
        <div className={`space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
          {/* Google Scholar */}
          <div>
            <label className="block text-xl font-semibold mb-2">
              {isArabic ? "رابط جوجل سكولار" : "Google Scholar Link"}
              <span className="text-[#B38E19]">*</span>
            </label>
            <input
              type="text"
              placeholder={
                isArabic ? "أدخل رابط جوجل سكولار" : "Enter Google Scholar link"
              }
              value={scholarLink}
              onChange={(e) => setScholarLink(e.target.value)}
              className="w-full bg-gray-200 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          {/* ORCID */}
          <div>
            <label className="block text-xl font-semibold mb-2">ORCID</label>
            <input
              type="text"
              placeholder={isArabic ? "أدخل ORCID" : "Enter ORCID"}
              value={orcid}
              onChange={(e) => setOrcid(e.target.value)}
              className="w-full bg-gray-200 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSave}
              className="bg-[#B38E19] text-white px-10 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {isArabic ? "حفظ" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
