import axiosInstance from "../utils/axiosInstance";

// Fetch nominated researches with pageSize = 4 by default
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
