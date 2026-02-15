import { useState, useEffect } from "react";
import { projectService } from "../services/projects.service";

export const useProjectLookups = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [projectRoles, setProjectRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLookups = async () => {
      setLoading(true);
      try {
        const [types, roles] = await Promise.all([
          projectService.fetchProjectTypes(),
          projectService.fetchProjectRoles(),
        ]);
        setProjectTypes(types);
        setProjectRoles(roles);
      } catch (err) {
        setError("Failed to load lookups"); // يمكن استبداله بالـ t() لاحقًا
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  return { projectTypes, projectRoles, loading, error };
};
