import { useState } from "react";
import { updateThesisSupervision } from "../services/supervisionThesis.service";

export default function useEditSupervision(initialData = {}) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitEdit = async (thesesId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await updateThesisSupervision(thesesId, formData);

      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          err.response.data?.message ||
            "Validation error. Please check your inputs.",
        );
      } else if (err.response?.status === 409) {
        setError("Conflict: This record may already exist.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    submitEdit,
    loading,
    error,
    success,
    setFormData, // for pre-filling data
  };
}
