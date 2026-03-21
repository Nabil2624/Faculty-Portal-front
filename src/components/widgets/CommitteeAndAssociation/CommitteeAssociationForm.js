import React from "react";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import CustomDropdown from "../../ui/CustomDropdown";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { UserRound  } from "lucide-react"; // أيقونة مناسبة للجان والجمعيات

export default function CommitteeAssociationForm({
  title, // العنوان الذي يظهر في الهيدر
  t,
  isArabic,

  committee,
  setCommittee,

  typeValue,
  setTypeValue,
  types = [],

  degreeValue,
  setDegreeValue,
  degrees = [],

  startDate,
  setStartDate,

  endDate,
  setEndDate,

  description,
  setDescription,

  error = {},
  serverError = "",

  onSave,
  onCancel,
  loading = false,
}) {
  const dir = isArabic ? "rtl" : "ltr";

  return (
    <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${dir}`}>
      {/* 1. Header بنفس ستايل ProjectForm */}
      <PageHeaderNoAction title={title || t("title")} icon={UserRound} />

      {/* 2. Main Container */}
      <main className="flex-1 p-[clamp(0.3rem,0.6vw,2.5rem)] flex items-center justify-center">
        {/* الحاوية البيضاء بدون overflow-hidden للسماح للدروب داون بالخروج */}
        <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
          
          {/* الفورم بدون سكرول داخلي لضمان فتح القوائم فوق الفوتر */}
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
            
            {/* القسـم الأيسـر - LEFT */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
              <InputField
                label={t("fields.committee")}
                value={committee}
                onChange={(e) => setCommittee(e.target.value)}
                placeholder={t("placeholders.committee")}
                required
                disabled={loading}
                error={error.committee}
              />

              {/* استخدام الـ Grid للدروب داون لضمان تناسق الشكل و z-index عالي */}
              <div className="grid grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)] items-start relative z-[100]">
                <CustomDropdown
                  label={t("fields.type")}
                  value={typeValue}
                  onChange={setTypeValue}
                  options={types.map((item) => ({
                    id: item.id,
                    label: isArabic ? item.valueAr : item.valueEn,
                  }))}
                  placeholder={t("placeholders.type")}
                  isArabic={isArabic}
                  required
                  disabled={loading}
                  error={error.typeValue}
                />

                <CustomDropdown
                  label={t("fields.degree")}
                  value={degreeValue}
                  onChange={setDegreeValue}
                  options={degrees.map((item) => ({
                    id: item.id,
                    label: isArabic ? item.valueAr : item.valueEn,
                  }))}
                  placeholder={t("placeholders.degree")}
                  isArabic={isArabic}
                  required
                  disabled={loading}
                  error={error.degreeValue}
                />
              </div>
            </div>

            {/* القسـم الأيمـن - RIGHT */}
            <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,1.5vw,2rem)]">
                <DateField
                  label={t("fields.startDate")}
                  value={startDate}
                  onChange={setStartDate}
                  required
                  disabled={loading}
                  placeholder={t("placeholders.startDate")}
                  error={error.startDate}
                  isArabic={isArabic}
                />

                <DateField
                  label={t("fields.endDate")}
                  value={endDate}
                  onChange={setEndDate}
                  disabled={loading}
                  placeholder={t("placeholders.endDate")}
                  error={error.endDate}
                  isArabic={isArabic}
                />
              </div>

              <div className="flex-1">
                <InputField
                  label={t("fields.description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("placeholders.description")}
                  textarea
                  disabled={loading}
                  className="h-full min-h-[clamp(150px,12vh,250px)]"
                />
              </div>

              {serverError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {serverError}
                </div>
              )}
            </div>
          </form>

          {/* 3. Footer ثابت في مكانه و z-index صفر */}
          <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
            <div
              className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="primary"
                  onClick={onSave}
                  disabled={loading}
                  className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                >
                  {t("buttons.save")}
                </FormButton>
              </div>
              <div className="min-w-[clamp(140px,8vw,220px)]">
                <FormButton
                  variant="secondary"
                  onClick={onCancel}
                  disabled={loading}
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