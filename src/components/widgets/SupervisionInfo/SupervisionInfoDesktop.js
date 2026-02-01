import InfoRow from "../../ui/InfoRow";

export default function SupervisionInfoDesktop({ info, t }) {
  return (
    <div className="grid grid-cols-3 gap-x-16 gap-y-6 max-w-[1400px] mx-auto">
      <InfoRow label={t("thesisType")} value={info.thesisType} />
      <InfoRow label={t("role")} value={info.role} />
      <InfoRow label={t("studentName")} value={info.studentName} />

      <InfoRow label={t("specialization")} value={info.specialization} />
      <InfoRow label={t("degree")} value={info.degree} />
      <InfoRow label={t("registrationDate")} value={info.registrationDate} />

      <InfoRow label={t("formationDate")} value={info.formationDate} />
      <InfoRow label={t("discussionDate")} value={info.discussionDate} />
      <InfoRow label={t("grantDate")} value={info.grantDate} />

      {/* Last row → only one item (this is OK and expected) */}
      <InfoRow label={t("university")} value={info.university} />
    </div>
  );
}
