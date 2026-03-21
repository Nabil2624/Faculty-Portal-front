import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSave, FiX, FiMail, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";

export default function EditContactInfo() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("contactinfo");
  const isArabic = i18n.language === "ar";

  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------
  // Fetch contact data
  // ----------------------------------------------------------
  const fetchContactData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/FacultyMemberData/ContactData",
        { skipGlobalErrorHandler: true }
      );
      setContactData(response.data || {});
    } catch (err) {
      console.error("Error fetching contact info:", err);
      if (err.response?.status === 401) navigate("/login");
      setContactData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // ----------------------------------------------------------
  // Handle input changes
  // ----------------------------------------------------------
  const handleChange = (field, value) => {
    setContactData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ----------------------------------------------------------
  // Save (PUT)
  // ----------------------------------------------------------
  const handleSave = async () => {
    try {
      await axiosInstance.put(
        "/FacultyMemberData/UpdateContactData",
        contactData,
        { skipGlobalErrorHandler: true }
      );
      navigate("/personal-data");
    } catch (err) {
      console.error("Error updating contact info:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // ----------------------------------------------------------
  // Structure
  // ----------------------------------------------------------
  const contactFields = [
    { label: t("officialEmail"), key: "officialEmail", editable: false },
    { label: t("mainMobile"), key: "mainPhoneNumber", editable: false },
    { label: t("personalEmail"), key: "personalEmail", editable: true },
    { label: t("alternativeEmail"), key: "alternativeEmail", editable: true },
    { label: t("homePhone"), key: "homePhoneNumber", editable: true },
    { label: t("workPhone"), key: "workPhoneNumber", editable: true },
    { label: t("fax"), key: "faxNumber", editable: true },
    { label: t("address"), key: "address", editable: true },
  ];

  if (loading || !contactData) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <style>{`
        .no-scroll-textarea::-webkit-scrollbar { width: 4px; }
        .no-scroll-textarea::-webkit-scrollbar-thumb { background: #b38e19; border-radius: 10px; }
        
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
              <FiPhone size={24} />
            </div>
            <div>
              <h2
                className="text-[#19355a] font-semibold leading-tight tracking-tight"
                style={{ fontSize: "var(--fluid-h2)" }}
              >
                {t("editContactInfo")}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider opacity-70">
                {isArabic ? "بيانات التواصل" : "Contact Information"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/personal-data")}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 dynamic-grid">
            {contactFields.map((item) => (
              <div key={item.key} className="flex flex-col">
                <label className="fluid-label font-black text-[#19355a]/50 mb-1 px-1 uppercase tracking-tight">
                  {item.label}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!item.editable}
                    value={contactData[item.key] || ""}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border-2 transition-all outline-none fluid-input text-center ${
                      !item.editable
                        ? "bg-gray-50 border-gray-100 text-gray-300 font-semibold cursor-not-allowed"
                        : "bg-white border-gray-100 focus:border-[#b38e19] focus:ring-[4px] focus:ring-[#b38e19]/5 shadow-sm font-medium"
                    }`}
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