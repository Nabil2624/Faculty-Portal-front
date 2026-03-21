import { useTranslation } from "react-i18next";
import { Plus, UserCircle, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Intro({ content, onSave }) {
  const { t, i18n } = useTranslation("dashboard");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempContent, setTempContent] = useState(content || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setTempContent(content || "");
    }
  }, [isModalOpen, content]);

  const focus = "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";
  const customScrollbar = "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto";

  const placeholderText =
    i18n.language === "ar"
      ? "تفضل بكتابة نبذة مختصرة تستعرض مسيرتكم الأكاديمية، تخصصكم الدقيق، وأبرز الاهتمامات البحثية."
      : "Please write a brief introduction highlighting your academic journey, exact specialization, and main research interests.";

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave?.(tempContent);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-white border border-gray-100 rounded-[clamp(14px,1vw,20px)] shadow-inner overflow-hidden">
      {/* Intro content container */}
      <div
        className={`flex flex-col w-full h-full p-[clamp(12px,1vw,25px)] cursor-pointer transition-colors duration-150 hover:bg-white/70 ${customScrollbar}`}
        onClick={() => setIsModalOpen(true)}
      >
        {!content || content.trim() === "" ? (
          <div className="flex flex-col items-center justify-center m-auto">
            <div className=" p-[clamp(8px,0.4vw,14px)] rounded-full  mb-[clamp(3px,0.2vw,16px)]">
              <Plus
                className="text-[#b38e19]"
                style={{
                  width: "clamp(24px,2.5vw,45px)",
                  height: "clamp(24px,2.5vw,45px)",
                }}
              />
            </div>
            <p className="text-[#19355A]/70 font-medium text-[clamp(12px,1.1vw,18px)] text-center leading-relaxed">
              {placeholderText}
            </p>
          </div>
        ) : (
          <div className="w-full text-start h-full">
            <div className="flex items-center gap-2 mb-[clamp(8px,1vw,16px)] sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="bg-[#19355A] p-[clamp(4px,0.4vw,8px)] rounded-md">
                    <UserCircle className="text-[#b38e19] w-[clamp(14px,1.2vw,20px)] h-[clamp(14px,1.2vw,20px)]" />
                </div>
                <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.3vw,22px)]">
                    {t("Intro")}
                </h3>
                <Edit3 className="w-[clamp(12px,1vw,16px)] h-[clamp(12px,1vw,16px)] text-[#b38e19] ms-auto" />
            </div>
            <p className="text-gray-700 text-[clamp(12px,1.05vw,17px)] break-words text-justify leading-relaxed px-1">
              {content}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-[clamp(10px,2vw,20px)]"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-[clamp(12px,1.5vw,20px)] p-[clamp(16px,2vw,30px)] w-full max-w-[650px] shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-[clamp(12px,1.5vw,20px)] border-b pb-3">
               <div className="bg-[#19355A] p-[clamp(6px,0.6vw,10px)] rounded-lg">
                  <Edit3 className="text-[#b38e19] w-[clamp(18px,1.5vw,24px)] h-[clamp(18px,1.5vw,24px)]" />
               </div>
               <h3 className="text-[#19355A] font-bold text-[clamp(16px,1.4vw,26px)]">
                 {t("WriteyourIntro")}
               </h3>
            </div>

            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              placeholder={placeholderText}
              className={`${focus} ${customScrollbar} w-full min-h-[clamp(200px,30vh,400px)] border border-gray-200 rounded-xl p-[clamp(12px,1.2vw,20px)] text-[clamp(14px,1.1vw,18px)] resize-none focus:outline-none bg-gray-50/50 text-[#19355A] leading-relaxed`}
              autoFocus
            />

            <div className="flex justify-end gap-[clamp(8px,1vw,15px)] mt-[clamp(15px,2vw,25px)]">
              <button
                className="px-[clamp(20px,2.5vw,40px)] py-[clamp(8px,1vw,12px)] text-black border border-gray-300 shadow-sm hover:bg-gray-100 rounded-lg transition-colors duration-150 font-semibold text-[clamp(12px,1vw,15px)]"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                {t("close")}
              </button>
              <button
                className="px-[clamp(20px,2.5vw,40px)] py-[clamp(8px,1vw,12px)] bg-[#b38e19] text-white border border-[#b38e19] rounded-lg shadow-md hover:bg-[#d6b137] disabled:opacity-50 transition-colors duration-150 font-bold text-[clamp(12px,1vw,15px)]"
                onClick={handleSave}
                disabled={loading || tempContent === content}
              >
                {loading ? "..." : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}