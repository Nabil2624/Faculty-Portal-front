import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
// GET paginated supervision theses
export const getSupervisionTheses = (
  pageIndex,
  pageSize,
  search,
  sort,
  GradeIds,
  Role,
  Type
) => {
  return axiosInstance.get("/ResearchesAndTheses/ThesesSupervising", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(GradeIds?.length && { GradeIds }),
      ...(Role?.length && { Role }),
      ...(Type?.length && { Type }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
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
