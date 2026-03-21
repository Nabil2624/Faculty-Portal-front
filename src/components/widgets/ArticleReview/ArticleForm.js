import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InputField from "../../ui/InputField";
import DateField from "../../ui/DateField";
import FormButton from "../../ui/FormButton";
import PageHeaderNoAction from "../../ui/PageHeaderNoAction";
import { FileText, Gavel, Pen } from "lucide-react";
import ResponsiveLayoutProvider from "../../ResponsiveLayoutProvider";
import { useAddArticle, useUpdateArticle } from "../../../hooks/useArticleForm";

export default function ArticleForm({ item, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("AddArticleForm");
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const isEdit = !!item;

  const { addArticle, loading: addLoading } = useAddArticle();
  const { updateArticle, loading: updateLoading } = useUpdateArticle();
  const loading = addLoading || updateLoading;

  const [titleOfArticle, setTitleOfArticle] = useState("");
  const [authority, setAuthority] = useState("");
  const [reviewingDate, setReviewingDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setTitleOfArticle(item.titleOfArticle || "");
      setAuthority(item.authority || "");
      setReviewingDate(item.reviewingDate || "");
      setDescription(item.description || "");
    }
  }, [item]);

  const validate = () => {
    const newErrors = {};
    if (!titleOfArticle.trim())
      newErrors.titleOfArticle = t("required_article_name");
    if (!authority.trim()) newErrors.authority = t("required_entity");
    if (!reviewingDate.trim())
      newErrors.reviewingDate = t("required_review_date");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    const payload = { titleOfArticle, authority, reviewingDate, description };

    try {
      if (isEdit) {
        await updateArticle(item.id, payload);
      } else {
        await addArticle(payload);
      }

      // ✅ التوجيه بيحصل هنا بعد نجاح الـ await
      onSuccess?.();
      navigate("/article-reviews");
    } catch (err) {
      setErrors({ submit: t("submit_error") });
    }
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`flex flex-col p-3 bg-[#f8fafc] h-[90vh] ${i18n.dir()}`}>
        <PageHeaderNoAction
          title={isEdit ? t("edit_article") : t("add_article")}
          icon={Gavel}
        />

        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="w-full max-w-[1500px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8"
            >
              <div className="space-y-6">
                <InputField
                  label={t("article_name")}
                  value={titleOfArticle}
                  onChange={(e) => setTitleOfArticle(e.target.value)}
                  placeholder={t("enter_article_name")} // 🆕 أضفنا الـ placeholder
                  required
                  error={errors.titleOfArticle}
                />
                <InputField
                  label={t("entity")}
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  placeholder={t("enter_entity")} // 🆕 أضفنا الـ placeholder
                  required
                  error={errors.authority}
                />
              </div>

              <div className="space-y-6 lg:border-s lg:ps-8 border-gray-100">
                <DateField
                  label={t("review_date")}
                  value={reviewingDate}
                  onChange={(val) => setReviewingDate(val)}
                  placeholder={t("select_review_date")} // 🆕 أضفنا الـ placeholder
                  required
                  error={errors.reviewingDate}
                  isArabic={i18n.language === "ar"}
                />
                <InputField
                  label={t("description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("enter_description")} // 🆕 أضفنا الـ placeholder
                  textarea
                  className="h-32"
                />
              </div>
            </form>

            <footer className="bg-gray-50/50 border-t border-gray-100 px-[clamp(1.5rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] relative z-0">
              <div
                className={`flex items-center gap-[clamp(1rem,1.5vw,2rem)] ${isArabic ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="min-w-[clamp(140px,8vw,220px)]">
                  <FormButton
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full !h-[clamp(45px,3vw,60px)] !text-[clamp(1rem,1.1vw,1.3rem)]"
                  >
                    {t("save")}
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
