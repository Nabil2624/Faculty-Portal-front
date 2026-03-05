import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
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

export const getResearches = async ({
  page,
  pageSize,
  search,
  sort,
  PublisherType,
  PublicationType,
  Source,
  DerivedFrom,
}) => {
  const response = await axiosInstance.get("/ResearchesAndTheses/Researches", {
    params: {
      pageIndex: page,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(PublisherType?.length && { PublisherType }),
      ...(Source?.length && { Source }),
      ...(DerivedFrom?.length && { DerivedFrom }),
      ...(PublicationType?.length && { PublicationType }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
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
      { skipGlobalErrorHandler: true },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchDOIData = async (doi) => {
  if (!doi) throw new Error("DOI is required");

  try {
    const response = await axiosInstance.get(
      `/ResearchesAndTheses/ResearchSearchDOI?doi=${encodeURIComponent(doi)}`,
      { skipGlobalErrorHandler: true },
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
      { skipGlobalErrorHandler: true },
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
      { skipGlobalErrorHandler: true },
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
      { skipGlobalErrorHandler: true },
    );

    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};



// Upload attachments for a research entity
export const uploadResearchAttachments = async (entityId, files) => {
  const formData = new FormData();

  // IMPORTANT: backend parameter name is "files"
  files.forEach((file) => {
    formData.append("files", file);
  });

  // context = 1 (Research)
  return axiosInstance.post(
    `/Attachments/${entityId}?context=1`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


export const downloadResearchAttachment = async (
  entityId,
  attachmentId
) => {
  return axiosInstance.get(
    `/Attachments/${entityId}/${attachmentId}?context=1`,
    {
      responseType: "blob", // VERY IMPORTANT
    }
  );
};


export const deleteResearchAttachment = async (entityId, attachmentId) => {
  return axiosInstance.delete(
    `/Attachments/${entityId}/${attachmentId}?context=1`
  );
};