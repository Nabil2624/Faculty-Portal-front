import axiosInstance from "../utils/axiosInstance";

export const getResearchDetails = async (id) => {
  if (!id) throw new Error("Research ID is required");

  try {
    const response = await axiosInstance.get(
      `/ResearchesAndTheses/Research/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getResearches = async ({ page, pageSize, search }) => {
  const response = await axiosInstance.get("/ResearchesAndTheses/Researches", {
    params: {
      pageIndex: page,
      pageSize,
      search,
    },
    skipGlobalErrorHandler: true,
  });

  return response.data;
};



// Save research
export const saveScientificResearch = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/ResearchesAndTheses/AddResearch",
      data,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch DOI data (GET)
export const fetchDOIData = async (doi) => {
  if (!doi) throw new Error("DOI is required");

  try {
    const response = await axiosInstance.get(
      `/ResearchesAndTheses/ResearchSearchDOI?doi=${encodeURIComponent(doi)}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch contributor data by ORCID
// Correct GET version
export const fetchContributorByORCID = async (orcid) => {
  if (!orcid) throw new Error("ORCID is required");

  try {
    const response = await axiosInstance.get(
      `/ResearchesAndTheses/ContributorDataWithORCID?orcid=${encodeURIComponent(orcid)}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateScientificResearch = async (id, data) => {
  if (!id) throw new Error("Research ID is required");

  try {
    const response = await axiosInstance.put(
      `/ResearchesAndTheses/UpdateResearch/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete research
export const deleteScientificResearch = async (researchId) => {
  if (!researchId) throw new Error("Research ID is required");

  try {
    const response = await axiosInstance.delete(
      `/ResearchesAndTheses/RemoveResearch/${researchId}`,
    );

    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};
