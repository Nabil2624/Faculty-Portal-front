import axiosInstance from "../utils/axiosInstance";

// GET paginated supervision theses
export const getSupervisionTheses = (pageIndex, pageSize) => {
  return axiosInstance.get("/ResearchesAndTheses/ThesesSupervising", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
};

// DELETE a supervision thesis by ID
export const deleteSupervisionThesis = (thesesId) => {
  return axiosInstance.delete(
    `/ResearchesAndTheses/RemoveThesesSupervising/${thesesId}`,
    { skipGlobalErrorHandler: true },
  );
};

// ADD a new supervision thesis
export const addSupervisionThesis = (payload) => {
  return axiosInstance.post(
    "/ResearchesAndTheses/AddThesesSupervising",
    payload,
    { skipGlobalErrorHandler: true },
  );
};

// UPDATE an existing supervision thesis
export const updateThesisSupervision = (thesesId, payload) => {
  return axiosInstance.put(
    `/ResearchesAndTheses/UpdateThesesSupervising/${thesesId}`,
    payload,
    { skipGlobalErrorHandler: true },
  );
};
