import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { downloadManifestationAttachment } from "../../../services/manifestationsOfScientificAppreciation";

function formatDate(dateString, i18n) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ManifestationDetailsModal({ item, onClose }) {
  const { t, i18n } = useTranslation("manifestations-of-scientific-appreciation");
  const isArabic = i18n.language === "ar";
  if (!item) return null;

  const handleDownload = async (attachment) => {
    try {
      const response = await downloadManifestationAttachment(item.id, attachment.id);

      const blob = new Blob([response.data], { type: attachment.contentType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="relative bg-white border-[clamp(1.5px,0.3vw,3px)] border-[#b38e19]
      rounded-[clamp(14px,2vw,22px)] shadow-2xl w-[clamp(320px,35vw,1000px)]
      max-w-[92%] p-[clamp(1rem,2.5vw,2rem)]"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-500`}
      >
        <X size={24} />
      </button>

      {/* Title */}
      <div className="text-center border-b pb-3 mb-4">
        <h2 className="font-semibold text-[clamp(1.2rem,2vw,3rem)]">
          {item.titleOfAppreciation}
        </h2>
      </div>

      {/* Details */}
      <div className="space-y-4 text-[clamp(0.85rem,1.2vw,2rem)]">
        <div className="flex justify-between">
          <span>{t("issuingAuthority")}</span>
          <span>{item.issuingAuthority}</span>
        </div>

        <div className="flex justify-between">
          <span>{t("dateOfAppreciation")}</span>
          <span>{formatDate(item.dateOfAppreciation, i18n)}</span>
        </div>

        {/* Attachments */}
        {item.attachments && item.attachments.length > 0 && (
          <div className="flex justify-between gap-3 items-center">
            <span>{t("attachments")}</span>
            <span className="flex flex-wrap gap-2">
              {item.attachments.map((a, i) => (
                <button
                  key={a.id}
                  className="text-[#B38E19] underline hover:opacity-80 transition"
                  onClick={() => handleDownload(a)}
                >
                  {a.fileName}
                  {i < item.attachments.length - 1 ? "," : ""}
                </button>
              ))}
            </span>
          </div>
        )}

        <div className="mt-5 bg-gray-100 p-4 rounded-lg break-words">
          {item.description}
        </div>
      </div>
    </div>
  );
}