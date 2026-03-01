import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getManifestations = (pageIndex, pageSize, search, sort) => {
  return axiosInstance.get("/Prizes/ManifestationsOfScientificAppreciation", {
    params: { pageIndex, pageSize, search, ...(sort && { sort }) },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};

export const createManifestation = (data) => {
  return axiosInstance.post(
    "/Prizes/CreateManifestationOfScientificAppreciation",
    data,
    { skipGlobalErrorHandler: true },
  );
};

export const updateManifestation = (id, data) => {
  return axiosInstance.put(
    `/Prizes/UpdateManifestationOfScientificAppreciation/${id}`,
    data,
    { skipGlobalErrorHandler: true },
  );
};

export const deleteManifestation = (id) => {
  return axiosInstance.delete(
    `/Prizes/DeleteManifestationOfScientificAppreciation/${id}`,
    { skipGlobalErrorHandler: true },
  );
};
