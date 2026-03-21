import { useState, memo, useCallback, useEffect } from "react";
import ActionIcons from "../../ui/ActionIcons";
import {
  Award,
  Calendar,
  Building2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { downloadPrizeAttachment } from "../../../services/prizesAndRewards.service";

// --- 1. مساعدات التنسيق ---
function formatDate(dateString, i18n) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- 2. مكون الهيدر (Memoized) ---
const TableHeader = memo(
  ({
    searchTerm,
    onSearchChange,
    onAdd,
    onFilterClick,
    t,
    THEME_COLOR,
    FS_SM,
    ICON_SM,
  }) => {
    return (
      <div className="p-3 border-b bg-gray-50 flex items-center justify-between gap-4 shrink-0">
        <div className="flex-1 max-w-md relative group">
          <div className="relative flex items-center">
            <div className="absolute start-3 z-10 text-gray-400 group-focus-within:text-[#b38e19] transition-colors">
              <Search style={{ width: "18px", height: "18px" }} />
            </div>
            <input
              type="text"
              value={searchTerm || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t("search") || "Search..."} // تم تعديل المفتاح ليتوافق مع الأب
              style={{
                paddingInlineStart: "clamp(2.2rem, 2vw, 3rem)",
                paddingBlock: "clamp(0.5rem, 0.5vw, 0.6rem)",
                width: "clamp(200px, 26.8vw, 412px)",
              }}
              className="bg-white border border-gray-200 rounded-lg outline-none focus:border-[#b38e19] focus:ring-1 focus:ring-[#b38e19]/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onFilterClick}
            className="p-3 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#b38e19] hover:border-[#b38e19] transition-all shadow-sm active:scale-95"
            title={t("filter")}
          >
            <Filter style={{ width: ICON_SM, height: ICON_SM }} />
          </button>
          <button
            onClick={onAdd}
            style={{ backgroundColor: THEME_COLOR, fontSize: FS_SM }}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-bold shrink-0 active:scale-95"
          >
            <Plus style={{ width: ICON_SM, height: ICON_SM }} />
            <span className="hidden md:inline">{t("add")}</span>
          </button>
        </div>
      </div>
    );
  },
);

// --- 3. مكون الفوتر (Memoized) ---
const TableFooter = memo(
  ({ currentPage, totalPages, onPageChange, isArabic, FS_BASE, ICON_SM }) => {
    return (
      <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-10 shrink-0">
        <div style={{ fontSize: FS_BASE }} className="font-black">
          {currentPage} / {totalPages}
        </div>
        <div className="flex gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="hover:scale-110 transition-transform disabled:opacity-30"
          >
            {isArabic ? (
              <ChevronRight style={{ width: ICON_SM, height: ICON_SM }} />
            ) : (
              <ChevronLeft style={{ width: ICON_SM, height: ICON_SM }} />
            )}
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="hover:scale-110 transition-transform disabled:opacity-30"
          >
            {isArabic ? (
              <ChevronLeft style={{ width: ICON_SM, height: ICON_SM }} />
            ) : (
              <ChevronRight style={{ width: ICON_SM, height: ICON_SM }} />
            )}
          </button>
        </div>
      </div>
    );
  },
);

// --- 4. المكون الرئيسي المحدث ---
const PrizesRewardsTable = ({
  data = [],
  onEdit,
  onDelete,
  onAdd,
  onFilterClick,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  t: propT, // نفضل استخدام t الممررة من الأب
}) => {
  // توحيد الـ namespace مع المكون الأب لضمان عمل الترجمة
  const { t: localT, i18n } = useTranslation("prizes-and-rewards");
  const t = propT || localT; // إذا لم تتوفر propT نستخدم localT
  const isArabic = i18n.language === "ar";
  const [selectedItem, setSelectedItem] = useState(null);

  const THEME_COLOR = "#b38e19";
  const MASTER_WIDTH = "clamp(280px, 30vw, 420px)";

  const FS_XS = "clamp(11px, 0.8vw, 14px)";
  const FS_SM = "clamp(13px, 1vw, 20px)";
  const FS_BASE = "clamp(15px, 1.4vw, 25px)";
  const FS_LG = "clamp(20px, 1.8vw, 35px)";
  const ICON_SM = "clamp(18px, 1.4vw, 26px)";
  const ICON_MD = "clamp(22px, 1.8vw, 34px)";
  const ICON_LG = "clamp(50px, 5vw, 140px)";
  const LH_TIGHT = "clamp(1.2, 1.4vw, 1.3)";
  const LH_NORMAL = "clamp(1.4, 1.6vw, 1.7)";

  useEffect(() => {
    if (selectedItem) {
      const exists = data.find((item) => item.id === selectedItem.id);
      if (!exists) setSelectedItem(null);
      else setSelectedItem(exists);
    }
  }, [data]);

  const handleSelect = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleDownload = async (attachment) => {
    try {
      const response = await downloadPrizeAttachment(
        selectedItem.id,
        attachment.id,
      );
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
      className="flex flex-col h-[73vh] 3xl:h-[83vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden text-gray-700"
    >
      <style>{`
        .custom-gold-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-gold-scrollbar::-webkit-scrollbar-track { background: #f8f9fa; }
        .custom-gold-scrollbar::-webkit-scrollbar-thumb { background: ${THEME_COLOR}; border-radius: 10px; }
      `}</style>

      <TableHeader
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onAdd={onAdd}
        onFilterClick={onFilterClick}
        t={t}
        THEME_COLOR={THEME_COLOR}
        FS_SM={FS_SM}
        ICON_SM={ICON_SM}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Master List */}
        <div
          className={`border-e overflow-y-auto custom-gold-scrollbar bg-white shrink-0 transition-all duration-300 ${
            selectedItem ? "hidden md:block" : "block"
          }`}
          style={{ width: selectedItem ? MASTER_WIDTH : "100%" }}
        >
          {data.length === 0 ? (
            <div
              className="p-10 text-center text-gray-400 italic"
              style={{ fontSize: FS_SM }}
            >
              {t("empty")}
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`border-b cursor-pointer hover:bg-gray-50 relative transition-all ${
                  selectedItem?.id === item.id ? "bg-amber-50/40" : ""
                }`}
                style={{ padding: "clamp(0.8rem, 1vw, 1.5rem)" }}
              >
                {selectedItem?.id === item.id && (
                  <div
                    className="absolute inset-y-0 start-0 w-1"
                    style={{ backgroundColor: THEME_COLOR }}
                  />
                )}
                <h4
                  className="font-semibold text-gray-800 break-words line-clamp-2"
                  style={{ fontSize: FS_BASE, lineHeight: LH_TIGHT }}
                >
                  {isArabic ? item.prize?.valueAr : item.prize?.valueEn}
                </h4>
                <div
                  className="flex justify-between items-center mt-3 opacity-70 font-semibold"
                  style={{ fontSize: FS_XS }}
                >
                  <span className="truncate flex-1">
                    {item.awardingAuthority}
                  </span>
                  <span className="shrink-0 bg-gray-100 px-3 py-1 rounded italic">
                    {formatDate(item.dateReceived, i18n)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail View */}
        <div
          className={`flex-1 overflow-y-auto custom-gold-scrollbar transition-all duration-300 ${
            !selectedItem
              ? "hidden md:flex items-center justify-center bg-gray-50/20"
              : "block"
          }`}
        >
          {selectedItem ? (
            <div className="p-10 md:p-14 mx-auto w-full">
              <button
                onClick={() => setSelectedItem(null)}
                className="md:hidden flex items-center gap-2 mb-8 font-bold text-[#b38e19]"
                style={{ fontSize: FS_SM }}
              >
                <ArrowLeft
                  style={{ width: ICON_SM, height: ICON_SM }}
                  className={isArabic ? "rotate-180" : ""}
                />
                {t("backToList")}
              </button>

              <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b pb-10">
                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center gap-4 mb-4"
                    style={{ color: THEME_COLOR }}
                  >
                    <Award style={{ width: ICON_MD, height: ICON_MD }} />
                    <span
                      style={{ fontSize: "clamp(22px, 1.5vw, 30px)" }}
                      className="font-semibold uppercase tracking-widest"
                    >
                      {t("prizeDetails")}
                    </span>
                  </div>
                  <h3
                    className="font-semibold text-gray-800 break-words"
                    style={{ fontSize: FS_LG, lineHeight: LH_TIGHT }}
                  >
                    {isArabic
                      ? selectedItem.prize?.valueAr
                      : selectedItem.prize?.valueEn}
                  </h3>
                </div>
                <ActionIcons
                  item={selectedItem}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <DetailRow
                  icon={
                    <Calendar style={{ width: ICON_SM, height: ICON_SM }} />
                  }
                  label={t("date")}
                  value={formatDate(selectedItem.dateReceived, i18n)}
                  color={THEME_COLOR}
                  FS_XS={FS_XS}
                  FS_SM={FS_SM}
                  LH_TIGHT={LH_TIGHT}
                />
                <DetailRow
                  icon={
                    <Building2 style={{ width: ICON_SM, height: ICON_SM }} />
                  }
                  label={t("organization")}
                  value={selectedItem.awardingAuthority}
                  color={THEME_COLOR}
                  FS_XS={FS_XS}
                  FS_SM={FS_SM}
                  LH_TIGHT={LH_TIGHT}
                />

                <div className="col-span-full">
                  <div className="flex items-center gap-2 mb-4 opacity-60">
                    <FileText size={16} />
                    <span
                      className="uppercase font-semibold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {t("attachments")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {selectedItem.attachments?.length > 0 ? (
                      selectedItem.attachments.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => handleDownload(a)}
                          className="flex items-center gap-3 px-4 py-2 border rounded-xl hover:bg-gray-50 transition-all group"
                        >
                          <Download size={16} className="text-[#b38e19]" />
                          <span className="text-sm font-medium underline decoration-[#b38e19]/30">
                            {a.fileName}
                          </span>
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        {t("noAttachments")}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="col-span-full mt-8 bg-gray-50 rounded-2xl border-s-4 shadow-sm"
                  style={{
                    borderInlineStartColor: THEME_COLOR,
                    padding: "clamp(1rem, 1.2vw, 2rem)",
                  }}
                >
                  <label
                    className="block uppercase mb-3 tracking-widest font-black"
                    style={{ fontSize: FS_SM }}
                  >
                    {t("description")}
                  </label>
                  <p
                    className="text-gray-700 italic break-words whitespace-pre-wrap text-justify"
                    style={{ fontSize: FS_SM, lineHeight: LH_NORMAL }}
                  >
                    {selectedItem.description || t("noDescriptionAdded")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-10 select-none">
              <Award
                style={{ width: ICON_LG, height: ICON_LG }}
                className="mx-auto mb-8"
              />
              <p className="font-black uppercase" style={{ fontSize: FS_LG }}>
                {t("selectItemToPreview")}
              </p>
            </div>
          )}
        </div>
      </div>

      <TableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isArabic={isArabic}
        FS_BASE={FS_BASE}
        ICON_SM={ICON_SM}
      />
    </div>
  );
};

// --- 5. مكون مساعد DetailRow ---
function DetailRow({ icon, label, value, color, FS_XS, FS_SM, LH_TIGHT }) {
  return (
    <div className="flex items-start gap-5 min-w-0">
      <div
        className="flex items-center justify-center rounded-xl bg-white border shadow-sm shrink-0"
        style={{
          color,
          width: "clamp(42px,3.5vw,52px)",
          height: "clamp(42px,3.5vw,52px)",
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="uppercase mb-2 font-semibold opacity-60"
          style={{ fontSize: "0.7rem" }}
        >
          {label}
        </p>
        <p
          className="font-semibold text-gray-800 break-words"
          style={{ fontSize: FS_SM, lineHeight: LH_TIGHT }}
        >
          {value || "---"}
        </p>
      </div>
    </div>
  );
}

export default memo(PrizesRewardsTable);
