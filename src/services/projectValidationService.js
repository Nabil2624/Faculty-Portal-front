export const projectValidationService = (payload, t) => {
  const errors = {};

  if (!payload.nameOfProject) {
    errors.projectName = t("errors.projectNameRequired");
  }

  if (!payload.typeOfProjectId) {
    errors.projectType = t("errors.projectTypeRequired");
  }

  if (!payload.participationRoleId) {
    errors.role = t("errors.roleRequired");
  }

  if (!payload.startDate) {
    errors.startDate = t("errors.startDateRequired");
  }

  if (!payload.financingAuthority) {
    errors.fundingSource = t("errors.fundingRequired");
  }

  return errors; // لو فاضي => لا أخطاء
};
