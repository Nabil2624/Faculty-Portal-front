// EditCommitteeAssociation.jsx
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CommitteeAssociationForm from "../components/widgets/CommitteeAndAssociation/CommitteeAssociationForm";

import useEditCommitteeForm from "../hooks/useEditCommitteeForm";
import useCommitteeLookups from "../hooks/useCommitteeLookups";
import { updateCommittee } from "../services/committees.service";

export default function EditCommitteeAssociation() {
  const { t, i18n } = useTranslation("add-committee");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();

  const navigate = useNavigate();
  const { state } = useLocation();
  const existingData = state?.item;

  // form state
  const { form, setForm, errors, validate } = useEditCommitteeForm(existingData, t);

  // lookups
  const { types, degrees, loading } = useCommitteeLookups();

  const handleSave = async () => {
    if (!validate()) return;

    try {
      // ⚡️ updateCommittee لم يتم تعديله
      await updateCommittee(existingData.id, {
        nameOfCommitteeOrAssociation: form.committee,
        typeOfCommitteeOrAssociationId: form.typeValue,
        degreeOfSubscriptionId: form.degreeValue,
        startDate: form.startDate,
        endDate: form.endDate || null,
        notes: form.description || null,
      });

      navigate("/committee-associations");
    } catch (err) {
      // console فقط في development
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating committee:", err);
      }

      // تخزين رسالة خطأ داخليًا فقط بدون alert
      setForm((prev) => ({
        ...prev,
        serverError: t("errors.genericSaveError") || "حدث خطأ أثناء الحفظ",
      }));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <CommitteeAssociationForm
          title={t("editCommittee.title")}
          t={t}
          isArabic={isArabic}
          error={errors}
          types={types}
          degrees={degrees}
          committee={form.committee}
          setCommittee={(v) => setForm({ ...form, committee: v })}
          typeValue={form.typeValue}
          setTypeValue={(v) => setForm({ ...form, typeValue: v })}
          degreeValue={form.degreeValue}
          setDegreeValue={(v) => setForm({ ...form, degreeValue: v })}
          startDate={form.startDate}
          setStartDate={(v) => setForm({ ...form, startDate: v })}
          endDate={form.endDate}
          setEndDate={(v) => setForm({ ...form, endDate: v })}
          description={form.description}
          setDescription={(v) => setForm({ ...form, description: v })}
          serverError={form.serverError} // ⚡️ الخطأ من السيرفر
          onSave={handleSave}
          onCancel={() => navigate("/committee-associations")}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
