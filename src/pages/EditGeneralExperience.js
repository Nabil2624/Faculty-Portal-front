import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import GeneralExperienceForm from
  "../components/widgets/GeneralExperiences/GeneralExperienceForm";

import useGeneralExperienceForm from
  "../hooks/useGeneralExperienceForm";

import { updateGeneralExperience } from
  "../services/generalExperience.service";

export default function EditGeneralExperience() {
  const { t, i18n } = useTranslation("add-general-experiences");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state?.item;

  // ⛔ لو الصفحة اتفتحت من غير state
  useEffect(() => {
    if (!item) {
      navigate("/general-experiences", { replace: true });
    }
  }, [item, navigate]);

  const {
    form,
    setForm,
    errors,
    validate,
    setServerErrors,
  } = useGeneralExperienceForm(t);

  const [loading, setLoading] = useState(false);

  // ✅ نملأ الفورم من الـ item
  useEffect(() => {
    if (item) {
      setForm({
        experienceTitle: item.experienceTitle || "",
        authority: item.authority || "",
        countryOrCity: item.countryOrCity || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        description: item.description || "",
      });
    }
  }, [item, setForm]);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // تحويل الحقول اللي مش required إلى null قبل الإرسال
      const payload = {
        ...form,
        endDate: form.endDate || null,
        description: form.description?.trim() || null,
      };

      await updateGeneralExperience(item.id, payload);
      navigate("/general-experiences");
    } catch (error) {
      setServerErrors(
        error.response?.data || { message: t("errors.failedEdit") }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;
  {loading && <LoadingSpinner />}

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <GeneralExperienceForm
          title={t("editGeneralExperience.title")}
          t={t}
          isArabic={isArabic}

          experience={form.experienceTitle}
          setExperience={(v) =>
            setForm((prev) => ({ ...prev, experienceTitle: v }))
          }

          authority={form.authority}
          setAuthority={(v) =>
            setForm((prev) => ({ ...prev, authority: v }))
          }

          countryCity={form.countryOrCity}
          setCountryCity={(v) =>
            setForm((prev) => ({ ...prev, countryOrCity: v }))
          }

          startDate={form.startDate}
          setStartDate={(v) =>
            setForm((prev) => ({ ...prev, startDate: v }))
          }

          endDate={form.endDate}
          setEndDate={(v) =>
            setForm((prev) => ({ ...prev, endDate: v }))
          }

          description={form.description}
          setDescription={(v) =>
            setForm((prev) => ({ ...prev, description: v }))
          }

          error={errors}
          onSave={handleSave}
          onCancel={() =>
            navigate("/general-experiences")
          }
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
