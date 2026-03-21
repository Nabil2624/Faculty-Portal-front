import { useState, useEffect } from "react";
import { jobGradeService } from "../services/jobGrade.service";

export const useJobGradeForm = (initialData, onSuccess) => {
  const [formData, setFormData] = useState({
    jobGrade: "",
    gradeDate: "",
    notes: "",
  });
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        setLoadingDegrees(true);
        const res = await jobGradeService.getDegrees();
        setDegrees(res.data || []);
      } catch (err) {
        setError((prev) => ({ ...prev, api: "Failed to fetch degrees" }));
      } finally {
        setLoadingDegrees(false);
      }
    };
    fetchDegrees();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        jobGrade: initialData.jobRank?.id || initialData.jobGrade || "",
        gradeDate: initialData.dateOfJobRank || initialData.gradeDate || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error[name]) setError((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (t) => {
    const newErrors = {};
    if (!formData.jobGrade) newErrors.jobGrade = t("job-grade-required");
    if (!formData.gradeDate) newErrors.gradeDate = t("grade-date-required");
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (t, isEdit = false) => {
    if (!validate(t)) return;
    setLoading(true);
    try {
      if (isEdit) {
        await jobGradeService.update(initialData.id, formData);
      } else {
        await jobGradeService.create(formData);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError({ api: t("submitError") });
    } finally {
      setLoading(false);
    }
  };

  return { formData, degrees, loading, loadingDegrees, error, handleChange, submit };
};