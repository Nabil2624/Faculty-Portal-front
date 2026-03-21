// src/services/missionValidationService.js
export const missionValidationService = (data, t) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.missionName = t("required_task_name");
  }
  if (!data.countryOrCity?.trim()) {
    errors.countryOrCity = t("required_country_city");
  }
  if (!data.startDate) {
    errors.startDate = t("required_start_date");
  }
  if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    errors.endDate = t("end_date_before_start");
  }

  return errors;
};