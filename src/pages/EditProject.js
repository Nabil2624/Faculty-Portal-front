import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";

import ProjectForm from "../components/widgets/Projects/ProjectForm";
import { useProjectLookups } from "../hooks/useProjectLookups";
import { useProjectForm } from "../hooks/useProjectForm";

export default function AddEditProject() {
  const { t, i18n } = useTranslation("AddProject");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();

  // data للـ edit تيجي من location.state.item
  const initialData = location.state?.item || {};

  // lookups
  const { projectTypes, projectRoles, loading: lookupsLoading } =
    useProjectLookups();

  // form hook
  const { loading: formLoading, error, handleSave } = useProjectForm(
    initialData,
    () => navigate("/projects")
  );

  if (lookupsLoading || formLoading) return <LoadingSpinner />;

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
