import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TrainingProgramForm from "../components/widgets/TrainingProgram/TrainingProgramForm";
import { trainingService } from "../services/trainingPrograms.service";

export default function AddTrainingProgram() {
  const { t, i18n } = useTranslation("add-training-program");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data) => {
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
      await trainingService.create(payload);
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
      onSave={handleSave}
      onCancel={() => navigate("/training-programs")}
      loading={loading}
      formTitle={t("addTrainingProgram")}
    />
  );
}