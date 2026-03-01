import axiosInstance from "../utils/axiosInstance";

// Fetch researcher profile
export const getResearcherProfile = async () => {
  try {
    const response = await axiosInstance.get(
      "/ResearchesAndTheses/ResearcherProfile",
      { skipGlobalErrorHandler: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching researcher profile:", error);
    throw error;
  }
};
