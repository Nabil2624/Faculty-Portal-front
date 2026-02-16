import axiosInstance from "../utils/axiosInstance";

export const getManifestations = (pageIndex, pageSize) => {
  return axiosInstance.get("/Prizes/ManifestationsOfScientificAppreciation", {
    params: { pageIndex, pageSize },
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
  );
};
