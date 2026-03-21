// src/pages/AddScientificMission.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ScientificMissionForm from "../components/widgets/ScientificMissions/ScientificMissionForm";
import { missionService } from "../services/scientificMission.service";
// import { toast } from "react-hot-toast";

export default function AddScientificMission() {
  const { t, i18n } = useTranslation("add-scientific-task");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});

  const handleSave = async (payload) => {
    setLoading(true);
    try {
      await missionService.create(payload);
    //   toast.success(t("success.created"));
      navigate("/scientific-missions");
    } catch (err) {
      setApiError( { general: t("submit_error") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScientificMissionForm
      t={t}
      isArabic={i18n.language === "ar"}
      onSave={handleSave}
      onCancel={() => navigate("/scientific-missions")}
      loading={loading}
      error={apiError}
      formTitle={t("addTask.title")}
    />
  );
}