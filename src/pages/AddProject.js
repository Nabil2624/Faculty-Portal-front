import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

import ProjectForm from "../components/widgets/Projects/ProjectForm";
import { useProjectLookups } from "../hooks/useProjectLookups";
import { useProjectForm } from "../hooks/useProjectForm";
import { projectService } from "../services/projects.service";

export default function AddEditProject() {
  const { t, i18n } = useTranslation("AddProject");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { id } = useParams(); // لو edit

  const { projectTypes, projectRoles, loading: lookupsLoading } = useProjectLookups();
  const [initialData, setInitialData] = useState(null);
  const { loading: formLoading, error, handleSave } = useProjectForm(initialData || {}, () =>
    navigate("/projects")
  );

  useEffect(() => {
    if (id) {
      projectService
        .getProjectById(id)
        .then((data) => setInitialData(data))
        .catch((err) => console.error(err));
    } else {
      setInitialData({});
    }
  }, [id]);

  if (lookupsLoading || formLoading || !initialData) return <LoadingSpinner />;

  return (
    <Layout>
      <ProjectForm
        t={t}
        isArabic={isArabic}
        projectTypes={projectTypes}
        projectRoles={projectRoles}
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => navigate("/projects")}
        error={error}
      />
    </Layout>
  );
}
