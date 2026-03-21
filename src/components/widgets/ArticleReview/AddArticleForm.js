import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { FileText } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";

export default function AddArticleForm({ onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("AddArticleForm");
  const navigate = useNavigate();
  const dir = i18n.dir();
  const isArabic = i18n.language === "ar";

  // 1. تعريف States منفصلة لكل حقل لضمان أعلى أداء واستقرار أثناء الكتابة
  const [titleOfArticle, setTitleOfArticle] = useState("");
  const [authority, setAuthority] = useState("");
  const [reviewingDate, setReviewingDate] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!titleOfArticle.trim()) newErrors.titleOfArticle = t("required_article_name");
    if (!authority.trim()) newErrors.authority = t("required_entity");
    if (!reviewingDate.trim()) newErrors.reviewingDate = t("required_review_date");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

  
    const finalData = {
      titleOfArticle,
      authority,
      reviewingDate,
      description,
    };

    try {
      const response = await axiosInstance.post(
        "/ProjectsAndCommittees/CreateReviewingArticle",
        finalData,
        { skipGlobalErrorHandler: true }
      );

      if (response.status === 200) {
        onSuccess?.(response.data);
        // التوجيه للصفحة المطلوبة
        navigate("/article-reviews");
        onCancel?.();
      } else {
        setErrors({ submit: t("submit_error") });
      }
    } catch (err) {
      setErrors({ submit: t("submit_error") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col bg-[#f8fafc] h-full ${dir}`}>
        <PageHeaderNoAction title={t("add_article")} icon={FileText} />

        <main className="flex-1 p-[clamp(1rem,2.5vw,2.5rem)] flex items-center justify-center">
          <div className="w-full max-w-[clamp(80%,92%,1600px)] bg-white rounded-[clamp(1rem,1.5vw,2rem)] shadow-xl border border-gray-100 flex flex-col relative">
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,5rem)] p-[clamp(1.5rem,2vw,4rem)] relative z-20">
              
              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)]">
                <InputField
                  label={t("article_name")}
                  name="titleOfArticle"
                  value={titleOfArticle}
                  onChange={(e) => setTitleOfArticle(e.target.value)} // تحديث مباشر
                  placeholder={t("enter_article_name")}
                  required
                  disabled={loading}
                  error={errors.titleOfArticle}
                />

                <InputField
                  label={t("entity")}
                  name="authority"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)} // تحديث مباشر
                  placeholder={t("enter_entity")}
                  required
                  disabled={loading}
                  error={errors.authority}
                />
              </div>

              <div className="space-y-[clamp(1rem,1.8vw,2.5rem)] lg:border-s lg:ps-[clamp(1.5rem,4vw,5rem)] border-gray-100 flex flex-col">
                <DateField
                  label={t("review_date")}
                  value={reviewingDate}
                  onChange={(val) => setReviewingDate(val)} // تحديث مباشر
                  required
                  disabled={loading}
                  placeholder={t("select_review_date")}
                  error={errors.reviewingDate}
                  isArabic={isArabic}
                />

                <div className="flex-1">
                  <InputField
                    label={t("description")}
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} // تحديث مباشر
                    placeholder={t("enter_description")}
                    textarea
                    disabled={loading}
                    className="h-full min-h-[clamp(150px,12vh,250px)]"
                  />
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
                    {errors.submit}
                  </div>
                )}
              </div>
            </form>

            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
              <div className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                  >
                    {loading ? t("loading") : t("add")}
                  </FormButton>
                </div>
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                  >
                    {t("cancel")}
                  </FormButton>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </ResponsiveLayoutProvider>
  );
}