import axiosInstance from "../utils/axiosInstance";

// Fetch nominated researches with pageSize = 4 by default
export const fetchNominatedResearches = (pageIndex = 1, pageSize = 4) => {
  const safePageSize = pageSize > 0 ? pageSize : 4;

  return axiosInstance.get("/ResearchesAndTheses/RecommendedResearches", {
    params: { pageIndex, pageSize: safePageSize },
    skipGlobalErrorHandler: true,
  });
};

// Approve nominated research
export const approveNominatedResearch = async (researchId) => {
  try {
    const response = await axiosInstance.put(
      `/ResearchesAndTheses/ApproveRecommendedResearch/${researchId}`,
      { skipGlobalErrorHandler: true },
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Reject nominated research
export const rejectNominatedResearch = async (researchId) => {
  try {
    const response = await axiosInstance.delete(
      `/ResearchesAndTheses/RejectRecommendedResearch/${researchId}`,
      { skipGlobalErrorHandler: true },
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
