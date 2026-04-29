import { useEffect, useState } from "react";
import { UniversityService } from "../services/dashboardAndReports.service";
import { useTranslation } from "react-i18next";
export const useFaculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar"
  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const res = await UniversityService.getFaculties();

      
      const mappedData = res.data.map((item) => ({
        id: item.id,
        name: isArabic ? item.nameAR : item.nameEN , 
      }));

      setFaculties(mappedData);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return {
    faculties,
    loading,
    refetch: fetchFaculties,
  };
};
