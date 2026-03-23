import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiUpload, FiCalendar, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "./LoadingSpinner";
import ResponsiveLayoutProvider from "./ResponsiveLayoutProvider";
import subPicture from "../assets/prof.jpg";

// --- Upload function تدعم array ---
export const handleProfilePictureUpload = (entityId, oldAttachmentId, files) => {
  if (!files || files.length === 0) return Promise.resolve();

  const formData = new FormData();
  const fileToSend = files[0]; // أول ملف فقط

  if (oldAttachmentId) {
    // تعديل صورة موجودة → newAttachment
    formData.append("newAttachment", fileToSend);

    return axiosInstance.put(
      `/Attachments/${entityId}/${oldAttachmentId}?context=3`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  } else {
    // رفع صورة جديدة → files
    formData.append("files", fileToSend);

    return axiosInstance.post(
      `/Attachments/${entityId}?context=3`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }
};
export default function EditPersonalInfo() {
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const routerData = location.state;

  const [personalInfo, setPersonalInfo] = useState({});
  const [profileImage, setProfileImage] = useState(subPicture);
  const [imageFiles, setImageFiles] = useState([]); // array من الصور
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const dateInputRef = useRef(null);

  // --- Fetch data on mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = routerData;
        if (!data) {
          const res = await axiosInstance.get("/FacultyMemberData/PersonalData");
          data = res.data;
        }
        setPersonalInfo(data || {});

        if (data?.profilePicture?.id) {
          setProfileImage(
            `${axiosInstance.defaults.baseURL}/Attachments/${data.id}/${data.profilePicture.id}?context=3`
          );
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [routerData]);

  const handleChange = (key, value) =>
    setPersonalInfo((prev) => ({ ...prev, [key]: value }));

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(filesArray);
      setProfileImage(URL.createObjectURL(filesArray[0])); // عرض أول صورة مؤقتًا
    }
  };
  const handleSave = async () => {
    const entityId = personalInfo.id;
    const oldAttachmentId = personalInfo.profilePicture?.id || null;

    if (!entityId) {
      setErr("User ID is missing.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      
      if (imageFiles.length > 0) {
        await handleProfilePictureUpload(entityId, oldAttachmentId, imageFiles);
      }

      // تحديث البيانات الشخصية
      await axiosInstance.put("/FacultyMemberData/UpdatePersonalData", personalInfo);

      navigate("/personal-data");
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      setErr(t("updateFailed") || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const orderedKeys = [
    { key: "name" },
    { key: "nationalNumber", disabled: true },
    { key: "nameInComposition" },
    { key: "birthDate", type: "date" },
    { key: "birthPlace" },
    { key: "gender", disabled: true },
    { key: "maritalStatus" },
    { key: "title" },
    { key: "university" },
    { key: "department" },
    { key: "authority" },
    { key: "field" },
    { key: "generalSpecialization" },
    { key: "accurateSpecialization" },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { display: none; }
        .no-scroll-textarea::-webkit-scrollbar { width: 4px; }
        .no-scroll-textarea::-webkit-scrollbar-thumb { background: #b38e19; border-radius: 10px; }
        :root {
          --fluid-text-xs: clamp(0.75rem, 0.7vw + 0.5rem, 0.875rem);
          --fluid-h2: clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem);
          --fluid-gap: clamp(0.625rem, 1.2vw, 1.70rem);
        }
      `}</style>

      <div className={`min-h-[90vh] w-full bg-[#fcfcfc] flex flex-col p-3 ${isArabic ? "rtl text-right" : "ltr text-left"}`}>
        {/* Header */}
        <div className="w-full flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border-b-[3px] border-[#b38e19] mb-6">
          <div className="flex items-center gap-3">
            <div className="relative group w-14 h-14 rounded-xl border-2 border-gray-100 overflow-hidden shadow-sm bg-gray-50 shrink-0">
              <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                <FiUpload className="text-white text-lg" />
                <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" multiple />
              </label>
            </div>
            <div>
              <h2 className="text-[#19355a] font-semibold text-xl leading-tight">{t("editPersonalData")}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{isArabic ? "البيانات الشخصية" : "Personal Data"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/personal-data")} className="px-6 py-2 text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center gap-1.5 transition-all">
              <FiX size={16} /> {t("cancel")}
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-xs bg-[#19355a] text-white font-black rounded-xl flex items-center gap-2 hover:bg-[#244a7d] transition-all shadow-md border-b-[3px] border-[#b38e19]">
              <FiSave size={14} className="text-[#b38e19]" /> {t("save")}
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          {err && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-bold">{err}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {orderedKeys.map((item) => {
              const isObj = ["title", "gender", "maritalStatus", "university", "department", "authority", "field"].includes(item.key);
              const val = isObj ? (isArabic ? personalInfo[item.key]?.valueAr : personalInfo[item.key]?.valueEn) : personalInfo[item.key];

              return (
                <div key={item.key} className="flex flex-col">
                  <label className="text-[10px] font-black text-[#19355a]/50 mb-1 px-1 uppercase tracking-tight">
                    {t(item.key)}
                  </label>
                  <div className="relative">
                    <input
                      type={item.type || "text"}
                      ref={item.type === "date" ? dateInputRef : null}
                      disabled={item.disabled}
                      value={val || ""}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className={`w-full h-10 px-3 rounded-xl border-2 transition-all outline-none text-sm text-center ${
                        item.disabled ? "bg-gray-50 border-gray-100 text-gray-300" : "bg-white border-gray-100 focus:border-[#b38e19] focus:ring-2 focus:ring-[#b38e19]/5"
                      }`}
                    />
                    {item.type === "date" && (
                      <FiCalendar
                        onClick={() => dateInputRef.current?.showPicker()}
                        className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-3" : "right-3"} text-[#b38e19] cursor-pointer hover:scale-110 transition-transform`}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Topics Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 pt-4 border-t border-gray-50">
              <label className="text-[10px] font-black text-[#19355a]/50 mb-2 block px-1 uppercase tracking-wider">
                {t("compositionTopicTitle")}
              </label>
              <textarea
                value={personalInfo.compositionTopics || ""}
                onChange={(e) => handleChange("compositionTopics", e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-2xl border-2 border-gray-100 bg-gray-50/30 focus:border-[#b38e19] focus:bg-white outline-none resize-none no-scroll-textarea transition-all text-sm"
                placeholder="..."
              />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
} 