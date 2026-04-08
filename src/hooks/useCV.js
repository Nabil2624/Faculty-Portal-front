import { useState, useEffect, useCallback } from "react";
import { getCVData } from "../services/cv.service";
import axiosInstance from "../utils/axiosInstance";

export default function useCV() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCVData();
      const raw = res.data;

      // Normalize name: backend sends nameAr; use it as the display name
      const normalized = {
        ...raw,
        name: raw.nameAr || raw.nameEn || "",
        profilePicture: null,
      };

      // Fetch profile picture as a blob URL if the ID is present
      if (raw.profilePictureId && raw.personalDataId) {
        try {
          const picRes = await axiosInstance.get(
            `/Attachments/${raw.personalDataId}/${raw.profilePictureId}?context=3`,
            { responseType: "blob" },
          );
          normalized.profilePicture = URL.createObjectURL(picRes.data);
        } catch {
          // profile picture unavailable – leave as null
        }
      }

      setData(normalized);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
