import InfoRow from "../../ui/InfoRow";

export default function SupervisionInfoTablet({ info, t }) {
  return (
    <div className="flex justify-center w-full">
      <div className="max-w-[720px] w-full flex flex-col gap-6">
        <InfoRow label={t("thesisType")} value={info.thesisType} />
        <InfoRow label={t("role")} value={info.role} />
        <InfoRow label={t("studentName")} value={info.studentName} />
        <InfoRow label={t("specialization")} value={info.specialization} />
        <InfoRow label={t("degree")} value={info.degree} />
        <InfoRow label={t("registrationDate")} value={info.registrationDate} />
        <InfoRow label={t("formationDate")} value={info.formationDate} />
        <InfoRow label={t("discussionDate")} value={info.discussionDate} />
        <InfoRow label={t("grantDate")} value={info.grantDate} />
        <InfoRow label={t("university")} value={info.university} />
      </div>
    </div>
  );
}
