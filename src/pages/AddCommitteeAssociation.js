import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import CommitteeAssociationForm from "../components/widgets/CommitteeAndAssociation/CommitteeAssociationForm"
import useAddCommitteeForm from "../hooks/useAddCommitteeForm";
import useCommitteeLookups from "../hooks/useCommitteeLookups";
import { createCommittee } from "../services/committees.service";

export default function AddCommitteeAssociation() {
  const { t, i18n } = useTranslation("add-committee");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const { form, setForm, errors, validate } = useAddCommitteeForm(t);

  // استخدم hook الموجود اللي بيجيب lookups
  const { types, degrees, loading } = useCommitteeLookups();

  const handleSave = async () => {
    if (!validate()) return;

    try {
      await createCommittee({
        nameOfCommitteeOrAssociation: form.committee,
        typeOfCommitteeOrAssociationId: form.typeValue,
        degreeOfSubscriptionId: form.degreeValue,
        startDate: form.startDate,
        endDate: form.endDate ? form.endDate : null,
        notes: form.description,
      });
      navigate("/committee-associations");
    } catch (error) {
      console.error(error);
      alert(t("errors.failedAdd"));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <CommitteeAssociationForm
          title={t("addCommittee.title")}
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
          onSave={handleSave}
          onCancel={() => navigate("/committee-associations")}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
