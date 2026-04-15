import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function MissingScholarCard({ onSave }) {
  const { t, i18n } = useTranslation("google-scholer-popUp");
  const isArabic = i18n.language === "ar";

  const [scholarLink, setScholarLink] = useState("");
  const [orcid, setOrcid] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    // 1. التحقق من أن الحقول ليست فارغة (باستخدام مفاتيح الترجمة)
    if (!scholarLink.trim() || !orcid.trim()) {
      setError(t("missingScholar.errors.required"));
      return;
    }

    // 2. استخراج وتنظيف الـ ORCID باستخدام Regex
    // يبحث عن نمط: 0000-0000-0000-0000
    const orcidPattern = /(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/;
    const match = orcid.match(orcidPattern);

    if (!match) {
      setError(t("missingScholar.errors.invalidOrcid"));
      return;
    }

    const cleanOrcid = match[0]; // الرقم المستخرج فقط

    setError("");
    onSave({ 
      scholarLink: scholarLink.trim(), 
      orcid: cleanOrcid 
    });
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="bg-[#F7F7F7] border border-[#B38E19] rounded-2xl shadow-md w-full max-w-2xl p-10">
        <div className={`space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
          
          {/* Google Scholar Input */}
          <div>
            <label className="block text-xl font-semibold mb-2">
              {t("missingScholar.labels.scholarLink")}
              <span className="text-red-500 mx-1">*</span>
            </label>
            <input
              type="text"
              placeholder={t("missingScholar.placeholders.scholarLink")}
              value={scholarLink}
              onChange={(e) => setScholarLink(e.target.value)}
              className="w-full bg-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#B38E19]"
            />
          </div>

          {/* ORCID Input */}
          <div>
            <label className="block text-xl font-semibold mb-2">
              {t("missingScholar.labels.orcid")}
              <span className="text-red-500 mx-1">*</span>
            </label>
            <input
              type="text"
              placeholder={t("missingScholar.placeholders.orcid")}
              value={orcid}
              onChange={(e) => setOrcid(e.target.value)}
              className="w-full bg-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#B38E19]"
            />
            <p className="text-gray-400 text-xs mt-1">
              {t("missingScholar.hints.orcidExample")}
            </p>
          </div>

          {/* Error Message Section */}
          {error && (
            <div className={`p-3 rounded bg-red-50 border-l-4 border-red-500 ${isArabic ? "border-l-0 border-r-4" : ""}`}>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSave}
              className="bg-[#B38E19] text-white px-10 py-2 rounded-lg font-semibold hover:opacity-90 transition shadow-sm"
            >
              {t("missingScholar.buttons.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}