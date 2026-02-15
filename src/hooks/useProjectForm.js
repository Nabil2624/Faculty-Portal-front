import { useState } from "react";
import { projectService } from "../services/projects.service";
import { useTranslation } from "react-i18next";

export const useProjectForm = (initialData = {}, onSuccess) => {
  const { t } = useTranslation("AddProject"); // namespace الفورم
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleSave = async (payload) => {
    setLoading(true);
    setError({});

    try {
      // Add vs Edit
      if (initialData.id) {
        await projectService.updateProject(initialData.id, payload);
      } else {
        await projectService.createProject(payload);
      }

      if (onSuccess) onSuccess();
    } catch (err) {

      if (err?.response?.data?.errors) {
    
        const apiErrors = {};
        for (const key in err.response.data.errors) {
          apiErrors[key] = t(`errors.${key}`) || err.response.data.errors[key];
        }
        setError(apiErrors);
      } else {
        // general submit error
        setError({ submit: t("errors.submitFailed") });
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleSave };
};
