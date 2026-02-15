import DateInput from "../../ui/DateInput";

export default function ThesisDates({ t, isArabic, state, actions, refs }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DateInput
        label={`${t("registrationDate")} *`}
        value={state.registrationDate}
        placeholder={t("registrationDatePlaceholder")}
        error={state.errors.registrationDate}
        dateRef={refs.registrationDateRef}
        onOpen={() => actions.openDatePicker(refs.registrationDateRef)}
        onChange={actions.setRegistrationDate}
        isArabic={isArabic}
      />

      <DateInput
        label={`${t("enrollmentDate")} *`}
        value={state.enrollmentDate}
        placeholder={t("enrollmentDatePlaceholder")}
        error={state.errors.enrollmentDate}
        dateRef={refs.enrollmentDateRef}
        onOpen={() => actions.openDatePicker(refs.enrollmentDateRef)}
        onChange={actions.setEnrollmentDate}
        isArabic={isArabic}
      />

      <DateInput
        label={t("internalDegreeDate")}
        value={state.internalDegreeDate}
        placeholder={t("internalDegreeDatePlaceholder")}
        dateRef={refs.internalDegreeDateRef}
        onOpen={() => actions.openDatePicker(refs.internalDegreeDateRef)}
        onChange={actions.setInternalDegreeDate}
        isArabic={isArabic}
      />

      <DateInput
        label={t("jointSupervisionDate")}
        value={state.jointSupervisionDate}
        placeholder={t("jointSupervisionDatePlaceholder")}
        dateRef={refs.jointSupervisionDateRef}
        onOpen={() => actions.openDatePicker(refs.jointSupervisionDateRef)}
        onChange={actions.setJointSupervisionDate}
        isArabic={isArabic}
      />
    </div>
  );
}
