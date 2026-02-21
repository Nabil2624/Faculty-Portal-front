import axiosInstance from "../utils/axiosInstance";

export const getManifestations = (pageIndex, pageSize, search) => {
  return axiosInstance.get("/Prizes/ManifestationsOfScientificAppreciation", {
    params: { pageIndex, pageSize, search },
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
