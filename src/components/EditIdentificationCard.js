import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSave, FiX, FiCreditCard, FiLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function EditIdentificationCard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("identification");
  const isArabic = i18n.language === "ar";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------
  // FETCH DATA
  // ------------------------------------------------------
  const fetchIdentification = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        "/FacultyMemberData/IdentificationCard",
        { skipGlobalErrorHandler: true },
      );
      setData(res.data || {});
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentification();
  }, []);

  // ------------------------------------------------------
  // SAVE
  // ------------------------------------------------------
  const handleSave = async () => {
    try {
      await axiosInstance.put(
        "/FacultyMemberData/UpdateIdentificationCard",
        data,
      );
      navigate("/personal-data");
    } catch (err) {
     
    }
  };

  // ------------------------------------------------------
  // HANDLE TYPING
  // ------------------------------------------------------
  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const identificationFields = [
    { label: t("ORCID-ID"), key: "orcid" },
    { label: t("ResearchGateProfile"), key: "researcherGate" },
    { label: t("Academia.Eduprofile"), key: "academiaEdu" },
    { label: t("ResearcherID"), key: "researcherId" },
    { label: t("EBK"), key: "ekb" },
  ];

  if (loading || data === null) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <style>{`
        :root {
          --fluid-text-xs: clamp(0.75rem, 0.7vw + 0.5rem, 0.875rem);
          --fluid-h2: clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem);
          --fluid-gap: clamp(0.625rem, 1.2vw, 1.70rem);
        }

        .dynamic-container { padding: clamp(0.5rem, 1.5vw, 1.5rem); }
        .dynamic-grid { gap: var(--fluid-gap); }
        .fluid-label { font-size: clamp(0.65rem, 0.5vw + 0.4rem, 0.75rem); }
        .fluid-input { font-size: var(--fluid-text-xs); }
      `}</style>

      <div
        className={`min-h-[90vh] w-full bg-[#fcfcfc] flex flex-col dynamic-container ${
          isArabic ? "rtl text-right" : "ltr text-left"
        }`}
      >
        {/* Header Section */}
        <div className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-[3px] border-[#b38e19] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#19355a]/5 border-2 border-gray-100 flex items-center justify-center text-[#19355a] shrink-0">
              <FiCreditCard size={24} />
            </div>
            <div>
              <h2
                className="text-[#19355a] font-semibold leading-tight tracking-tight"
                style={{ fontSize: "var(--fluid-h2)" }}
              >
                {t("editIdentificationCard")}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider opacity-70">
                {isArabic ? "بطاقات التعريف" : "Academic Identifiers"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/Personal-data")}
              className="px-7 py-2 text-xs text-gray-400 hover:text-gray-600 font-bold rounded-xl flex shadow-md items-center gap-1.5 transition-all border border-[#b38e19] bg-white"
            >
              <FiX size={16} /> {t("cancel")}
            </button>
            <button
              onClick={handleSave}
              className="px-7 py-2 text-xs bg-[#19355a] text-white font-black rounded-xl flex items-center gap-2 hover:bg-[#244a7d] transition-all shadow-md active:scale-95 border-b-[3px] border-[#b38e19]"
            >
              <FiSave size={14} className="text-[#b38e19]" /> {t("save")}
            </button>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="flex-grow bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 dynamic-grid">
            {identificationFields.map((item) => (
              <div key={item.key} className="flex flex-col">
                <label className="fluid-label font-black text-[#19355a]/50 mb-1 px-1 uppercase tracking-tight">
                  {item.label}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={data[item.key] || ""}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 transition-all outline-none fluid-input text-center bg-white border-gray-100 focus:border-[#b38e19] focus:ring-[4px] focus:ring-[#b38e19]/5 shadow-sm font-medium"
                  />
                  <FiLink
                    className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-3" : "right-3"} text-gray-200 group-focus-within:text-[#b38e19] transition-colors`}
                    size={14}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
