import axiosInstance from "../utils/axiosInstance";

// Fetch nominated researches (already exists)
export const fetchNominatedResearches = (pageIndex = 1, pageSize = 4) => {
  return axiosInstance.get("/ResearchesAndTheses/RecommendedResearches", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
};

// Approve nominated research
export const approveNominatedResearch = async (researchId) => {
  try {
    const response = await axiosInstance.put(
      `/ResearchesAndTheses/ApproveRecommendedResearch/${researchId}`,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
