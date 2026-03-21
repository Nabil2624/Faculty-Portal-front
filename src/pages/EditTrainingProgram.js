import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import TrainingProgramForm from "../components/widgets/TrainingProgram/TrainingProgramForm";
import { trainingService } from "../services/trainingPrograms.service";

export default function EditTrainingProgram() {
  const { t, i18n } = useTranslation("add-training-program");
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state?.item || {};
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const payload = {
        type: data.programType,
        participationType: data.participationType,
        trainingProgramName: data.programName,
        organizingAuthority: data.organizingAuthority,
        venue: data.venue,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      };
      await trainingService.update(data.id, payload);
      navigate("/training-programs");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainingProgramForm
      t={t}
      isArabic={i18n.language === "ar"}
      initialData={existingData}
      onSave={handleUpdate}
      onCancel={() => navigate("/training-programs")}
      loading={loading}
      formTitle={t("editTrainingProgram")}
    />
  );
}