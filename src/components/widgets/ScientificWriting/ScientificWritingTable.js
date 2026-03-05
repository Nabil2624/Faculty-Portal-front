import { useState, memo } from "react";
import ActionIcons from "../../ui/ActionIcons";
import {
  BookOpen,
  Calendar,
  Building2,
  Hash,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function formatDate(dateString, i18n, t) {
  if (!dateString) return t("present");
  const date = new Date(dateString);
  return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ScientificWritingTable = ({
  data = [],
  onEdit,
  onDelete,
  onAdd,
  currentPage,
  totalPages,
  onPageChange,
  renderSearch,
}) => {
  const { t, i18n } = useTranslation("scientific-writing");
  const isArabic = i18n.language === "ar";
  const [selectedItem, setSelectedItem] = useState(null);

  const THEME_COLOR = "#b38e19";
  const MASTER_WIDTH = "clamp(280px, 30vw, 420px)";

  // 🔥 Clamp Typography System
  const FS_XS = "clamp(11px, 0.8vw, 14px)";
  const FS_SM = "clamp(13px, 1vw, 20px)";
  const FS_BASE = "clamp(15px, 1.4vw, 25px)";
  const FS_LG = "clamp(20px, 1.8vw, 35px)";
  const FS_XL = "clamp(26px, 2vw, 45px)";

  const LH_TIGHT = "clamp(1.2, 1.4vw, 1.3)";
  const LH_NORMAL = "clamp(1.4, 1.6vw, 1.7)";

  const ICON_SM = "clamp(18px, 1.4vw, 26px)";
  const ICON_MD = "clamp(22px, 1.8vw, 34px)";
  const ICON_LG = "clamp(50px, 5vw, 140px)";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="flex flex-col h-[clamp(500px,72vh,950px)] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden text-gray-700"
    >
      {/* 💅 Custom Scrollbar Styles */}
      <style>{`
        .custom-gold-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-gold-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .custom-gold-scrollbar::-webkit-scrollbar-thumb {
          background: ${THEME_COLOR};
          border-radius: 10px;
        }
        .custom-gold-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8e7114;
        }
      `}</style>

      {/* Header */}
      <div className="p-3 border-b bg-gray-50 flex items-center justify-between gap-4 shrink-0">
        <div style={{ width: MASTER_WIDTH }}>
          {renderSearch && renderSearch()}
        </div>

        <button
          onClick={onAdd}
          style={{
            backgroundColor: THEME_COLOR,
            fontSize: FS_SM,
            paddingLeft: "clamp(0.3rem, 1vw, 1.6rem)",
            paddingRight: "clamp(0.3rem, 1vw, 1.6rem)",
          }}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-bold shrink-0"
        >
          <Plus style={{ width: ICON_SM, height: ICON_SM }} />
          <span className="hidden md:inline">{t("addNew")}</span>
        </button>
      </div>

      {/* Main */}
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
              {t("noDataAvailable")}
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={` border-b cursor-pointer hover:bg-gray-50 relative transition-all ${
                  selectedItem?.id === item.id ? "bg-amber-50/40" : ""
                }`}
                style={{
                  paddingRight: "clamp(1rem, 1.2vw, 2rem)",
                  paddingLeft: "clamp(1rem, 1.2vw, 2rem)",
                  paddingTop: "clamp(0.3rem, 0.5vw, 1rem)",
                  paddingBottom: "clamp(0.3rem, 0.5vw, 1rem)",
                }}
              >
                {selectedItem?.id === item.id && (
                  <div
                    className="absolute inset-y-0 start-0 w-1"
                    style={{ backgroundColor: THEME_COLOR }}
                  />
                )}

                <h4
                  className="font-semibold text-gray-800 break-words line-clamp-2"
                  style={{
                    fontSize: FS_BASE,
                    lineHeight: LH_TIGHT,
                  }}
                >
                  {item.title}
                </h4>

                <div
                  className="flex justify-between items-center mt-3 opacity-70 font-semibold"
                  style={{ fontSize: FS_XS }}
                >
                  <span className="truncate flex-1">
                    {isArabic
                      ? item.authorRole?.valueAr
                      : item.authorRole?.valueEn}
                  </span>

                  <span className="shrink-0 bg-gray-100 px-3 py-1 rounded italic">
                    {formatDate(item.publishingDate, i18n, t)}
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
            <div className="p-10 md:p-14 max-w-6xl mx-auto w-full">
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

              {/* Title Section */}
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b pb-10">
                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center gap-4 mb-4"
                    style={{ color: THEME_COLOR }}
                  >
                    <BookOpen style={{ width: ICON_MD, height: ICON_MD }} />
                    <span
                      style={{ fontSize: "clamp(26px, 1.5vw, 35px)" }}
                      className=" font-semibold uppercase tracking-widest"
                    >
                      {t("documentDetails")}
                    </span>
                  </div>

                  <h3
                    className="font-semibold text-gray-900 break-words"
                    style={{
                      fontSize: FS_LG,
                      lineHeight: LH_TIGHT,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {selectedItem.title}
                  </h3>
                </div>

                <ActionIcons
                  item={selectedItem}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <DetailRow
                  icon={
                    <Calendar style={{ width: ICON_SM, height: ICON_SM }} />
                  }
                  label={t("publishingDate")}
                  value={formatDate(selectedItem.publishingDate, i18n, t)}
                  color={THEME_COLOR}
                  FS_XS={FS_XS}
                  FS_SM={FS_SM}
                  LH_TIGHT={LH_TIGHT}
                />

                <DetailRow
                  icon={
                    <Building2 style={{ width: ICON_SM, height: ICON_SM }} />
                  }
                  label={t("publishingHouse")}
                  value={selectedItem.publishingHouse}
                  color={THEME_COLOR}
                  FS_XS={FS_XS}
                  FS_SM={FS_SM}
                  LH_TIGHT={LH_TIGHT}
                />

                <DetailRow
                  icon={<Hash style={{ width: ICON_SM, height: ICON_SM }} />}
                  label={t("isbn")}
                  value={selectedItem.isbn}
                  color={THEME_COLOR}
                  FS_XS={FS_XS}
                  FS_SM={FS_SM}
                  LH_TIGHT={LH_TIGHT}
                />

                <DetailRow
                  icon={<Plus style={{ width: ICON_SM, height: ICON_SM }} />}
                  label={t("authorRole")}
                  value={
                    isArabic
                      ? selectedItem.authorRole?.valueAr
                      : selectedItem.authorRole?.valueEn
                  }
                  color={THEME_COLOR}
                  FS_XS={FS_XS}
                  FS_SM={FS_SM}
                  LH_TIGHT={LH_TIGHT}
                />

                <div
                  className="col-span-full mt-8  bg-gray-50 rounded-2xl border-s-4 shadow-sm"
                  style={{
                    borderInlineStartColor: THEME_COLOR,
                    padding: "clamp(1rem, 1.2vw, 2rem)",
                  }}
                >
                  <label
                    className="block uppercase mb-3 tracking-widest font-black"
                    style={{ fontSize: FS_SM }}
                  >
                    {t("summaryDescription")}
                  </label>

                  <p
                    className="text-gray-700 italic break-words whitespace-pre-wrap"
                    style={{
                      fontSize: FS_SM,
                      lineHeight: LH_NORMAL,
                    }}
                  >
                    {selectedItem.description || t("noDescriptionAdded")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-10 select-none">
              <BookOpen
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

      {/* Pagination */}
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
    </div>
  );
};

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
        <p className="uppercase mb-2 font-semibold" style={{ fontSize: FS_SM }}>
          {label}
        </p>

        <p
          className=" break-words"
          style={{
            fontSize: FS_XS,
            lineHeight: LH_TIGHT,
          }}
        >
          {value || "---"}
        </p>
      </div>
    </div>
  );
}

export default memo(ScientificWritingTable);