import axiosInstance from "../utils/axiosInstance";

export const getResearcherProfile = async () => {
  return await axiosInstance.get(
    "/ResearchesAndTheses/ResearcherProfile"
  );
};
