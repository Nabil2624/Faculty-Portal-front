// src/pages/EditScientificMission.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ScientificMissionForm from "../components/widgets/ScientificMissions/ScientificMissionForm";
import { missionService } from "../services/scientificMission.service";
// import { toast } from "react-hot-toast";

export default function EditScientificMission() {
  const { t, i18n } = useTranslation("add-scientific-task");
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});

  const handleSave = async (payload) => {
    setLoading(true);
    try {
      await missionService.update(item.id, payload);
    //   toast.success(t("success.updated"));
      navigate("/scientific-missions");
    } catch (err) {
      setApiError( { general: t("submit_error") });
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    navigate("/scientific-missions");
    return null;
  }

  return (
    <ScientificMissionForm
      t={t}
      isArabic={i18n.language === "ar"}
      initialData={item}
      onSave={handleSave}
      onCancel={() => navigate("/scientific-missions")}
      loading={loading}
      error={apiError}
      formTitle={t("editTask.title")}
    />
  );
}