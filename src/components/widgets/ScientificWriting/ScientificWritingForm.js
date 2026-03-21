import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { BookType, Layers } from "lucide-react";

export default function ScientificWritingForm({
  formTitle,
  t,
  isArabic,
  title,
  setTitle,
  role,
  setRole,
  roles = [],
  isbn,
  setIsbn,
  setPublishingHouse,
  publishingHouse,
  publishingDate,
  setPublishingDate,
  description,
  setDescription,
  error = {},
  serverError = "",
  onSave,
  onCancel,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  return (
    <div className={`flex flex-col bg-[#f8fafc] p-3 h-[90vh] overflow-hidden ${dir}`}>
      {/* 1. Header */}
      <PageHeaderNoAction title={formTitle} icon={BookType}/>

      {/* 2. Main Container */}
      <main className="flex-1 p-[clamp(1rem,2.5vw,2.5rem)] flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[clamp(80%,92%,1600px)] h-full max-h-[800px] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col overflow-hidden">
          <form className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)]">
            {/* القسـم الأيسـر */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
              <InputField
                label={t("fields.Booktitle")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("placeholders.Booktitle")}
                required
                error={error.title}
              />

              {/* تم دمج الـ Grid ليكون الدروب داون والـ ISBN على خط واحد بمقاسات متطابقة */}
              <div className="grid grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)] items-start">
                <CustomDropdown
                  label={t("fields.role")}
                  value={role}
                  onChange={setRole}
                  options={roles.map((item) => ({
                    id: item.id,
                    label: isArabic ? item.valueAr : item.valueEn,
                  }))}
                  placeholder={t("placeholders.role")}
                  isArabic={isArabic}
                  required
                  error={error.role} // نمرر الخطأ للمكون نفسه
                />

                <InputField
                  label={t("fields.isbn")}
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder={t("placeholders.isbn")}
                  required
                  error={error.isbn}
                />
              </div>

              <InputField
                label={t("fields.publishingHouse")}
                value={publishingHouse}
                onChange={(e) => setPublishingHouse(e.target.value)}
                placeholder={t("placeholders.publishingHouse")}
                required
                error={error.publishingHouse}
              />
            </div>

            {/* القسـم الأيمـن */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
              <DateField
                label={t("fields.publishingDate")}
                value={publishingDate}
                onChange={setPublishingDate}
                required
                placeholder={t("placeholders.publishingDate")}
                error={error.publishingDate}
                isArabic={isArabic}
              />

              <div className="flex-1">
                <InputField
                  label={t("fields.description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("placeholders.description")}
                  textarea
                  className="h-full min-h-[clamp(150px,15vh,300px)]"
                />
              </div>

              {serverError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {serverError}
                </div>
              )}
            </div>
          </form>

          {/* 3. Footer */}
          <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)]">
            <div
              className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="primary"
                  onClick={onSave}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {t("buttons.save")}
                </FormButton>
              </div>
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="secondary"
                  onClick={onCancel}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {t("buttons.cancel")}
                </FormButton>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
