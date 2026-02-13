import { useState, useEffect } from "react";
import { getThesisById } from "../services/theses.services";

export default function useThesisDetails(id) {
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getThesisById(id);
      setThesis(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return { thesis, loading, error };
}
