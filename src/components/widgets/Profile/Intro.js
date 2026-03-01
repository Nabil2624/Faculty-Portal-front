import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

export default function Intro({ content, onSave }) {
  const { t, i18n } = useTranslation("dashboard");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempContent, setTempContent] = useState(content || "");
  const [loading, setLoading] = useState(false);

  // Sync tempContent كل مرة البوب أب تفتح
  useEffect(() => {
    if (isModalOpen) {
      setTempContent(content || "");
    }
  }, [isModalOpen, content]);

  const focus =
    "focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(179,142,25,0.5)]";

  const placeholderText =
    i18n.language === "ar"
      ? "تفضل بكتابة نبذة مختصرة تستعرض مسيرتكم الأكاديمية، تخصصكم الدقيق، وأبرز الاهتمامات البحثية."
      : "Please write a brief introduction highlighting your academic journey, exact specialization, and main research interests.";

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave?.(tempContent); // نرسل النص سواء فاضي أو مليان
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Intro content */}
      <div
        className="flex flex-col items-center justify-center w-full h-full p-[clamp(12px,1vw,25px)] cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {!content || content.trim() === "" ? (
          <div className="flex flex-col items-center justify-center">
            <Plus
              className="text-[#b38e19]"
              style={{
                width: "clamp(40px,4vw,85px)",
                height: "clamp(40px,4vw,85px)",
              }}
            />
            <p className="text-[#19355A] text-[clamp(12px,1.2vw,40px)] text-center mt-[clamp(6px,1vw,12px)]">
              {placeholderText}
            </p>
          </div>
        ) : (
          <div className="w-full text-start">
            <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.4vw,45px)] mb-[clamp(4px,0.5vw,10px)]">
              {t("Intro")}
            </h3>
            <p className="text-gray-700 text-[clamp(12px,1.2vw,40px)] break-words">
              {content}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // الضغط على overlay يقفل المودال
        >
          <div
            className="bg-white rounded-[clamp(8px,1vw,16px)] p-[clamp(12px,1vw,20px)] w-[clamp(280px,50vw,500px)]"
            onClick={(e) => e.stopPropagation()} // الضغط داخل المودال لا يغلقه
          >
            <h3 className="text-[#19355A] font-bold text-[clamp(14px,1.1vw,22px)] mb-[clamp(6px,0.5vw,12px)]">
              {t("WriteyourIntro")}
            </h3>

            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              placeholder={placeholderText}
              className={`${focus} w-full h-[clamp(100px,20vh,200px)] border border-gray-400 rounded p-2 text-[clamp(12px,1vw,16px)] resize-none focus:outline-none`}
            />

            <div className="flex justify-end gap-2 mt-[clamp(6px,1vw,12px)]">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                {t("close")}
              </button>
              <button
                className="px-4 py-2 bg-[#b38e19] text-white rounded disabled:opacity-50"
                onClick={handleSave}
                disabled={loading || tempContent === content}
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
