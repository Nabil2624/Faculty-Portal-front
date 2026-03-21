import { useState, useEffect } from "react";
import { committeeService } from "../services/committeeService";

export const useCommitteeForm = (initialData, t) => {
  const [loading, setLoading] = useState(false);
  const [lookups, setLookups] = useState({ degrees: [], types: [] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoading(true);
        const [degRes, typeRes] = await Promise.all([
          committeeService.getDegrees(),
          committeeService.getTypes(),
        ]);
        setLookups({ degrees: degRes.data || [], types: typeRes.data || [] });
      } catch (err) {
        console.error("Lookup Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLookups();
  }, []);

  const validate = (data) => {
    const newErrors = {};
    if (!data.nameOfCommitteeOrAssociation) newErrors.committeeName = t("errors.committeeRequired");
    if (!data.typeOfCommitteeOrAssociationId) newErrors.typeValue = t("errors.typeRequired");
    if (!data.degreeOfSubscriptionId) newErrors.degreeValue = t("errors.degreeRequired");
    if (!data.startDate) newErrors.startDate = t("errors.startDateRequired");
    
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) > new Date(data.endDate)) {
        newErrors.endDate = t("errors.startBeforeEnd");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { lookups, loading, setLoading, errors, setErrors, validate };
};