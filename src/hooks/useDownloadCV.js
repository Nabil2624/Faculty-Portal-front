import { useState } from "react";
import { getCV } from "../services/global.service";

const useDownloadCV = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadCV = async (facultyMemberId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCV(facultyMemberId);

      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    downloadCV,
    loading,
    error,
  };
};

export default useDownloadCV;