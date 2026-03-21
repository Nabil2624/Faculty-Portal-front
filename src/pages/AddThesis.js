import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useThesisForm } from "../hooks/useThesisForm";
import ThesisForm from "../components/widgets/Theses/ThesisForm";

export default function AddThesis() {
  const { t } = useTranslation("AddThesis");
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);

  const { values, setters, helpers, errors, loading } = useThesisForm({
    mode: "add",
    t,
  });

  return (
    <ThesisForm
      values={values}
      setters={setters}
      helpers={helpers}
      errors={errors}
      loading={loading}
      attachments={attachments}
      setAttachments={setAttachments}
      onCancel={() => navigate("/theses")}
      formTitle={t("pageTitle")}
    />
  );
}