import { X } from "lucide-react";
import { downloadPrizeAttachment } from "../../../services/prizesAndRewards.service";

export default function PrizeDetailsModal({ item, onClose, t, isArabic }) {
  if (!item) return null;

  const handleDownload = async (attachment) => {
    try {
      const response = await downloadPrizeAttachment(item.id, attachment.id);

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
      className="relative bg-white border-[clamp(1.5px,0.3vw,3px)] border-[#B38E19] rounded-[clamp(14px,2vw,22px)] shadow-2xl w-[clamp(320px,35vw,1000px)] max-w-[92%] p-[clamp(1rem,2.5vw,2rem)]"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-500`}
      >
        <X size={24} />
      </button>

      {/* Title */}
      <div className="text-center border-b pb-3 mb-4">
        <h2 className="font-semibold text-[clamp(1.2rem,2vw,3rem)]">
          {isArabic ? item.prize?.valueAr : item.prize?.valueEn}
        </h2>
      </div>

      <div className="space-y-4 text-[clamp(0.85rem,1.2vw,2rem)]">
        {/* Awarding Authority */}
        <div className="flex justify-between">
          <span>{t("organization")}</span>
          <span>{item.awardingAuthority}</span>
        </div>

        {/* Date Received */}
        <div className="flex justify-between">
          <span>{t("date")}</span>
          <span>{item.dateReceived}</span>
        </div>

        {/* Attachments ABOVE description */}
        {item.attachments && item.attachments.length > 0 && (
          <div className="flex flex-wrap items-end gap-9">
            <span className="font-medium">{t("attachments")}:</span>
            {item.attachments.map((a) => (
              <button
                key={a.id}
                className="text-[#B38E19] underline hover:opacity-80 transition"
                onClick={() => handleDownload(a)}
              >
                {a.fileName}
              </button>
            ))}
          </div>
        )}
        {/* Description */}
        {item.description && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg break-words">
            {item.description}
          </div>
        )}
      </div>
    </div>
  );
}
