import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getAdminPosition = async ({ page, pageSize, search, sort }) => {
  const res = await axiosInstance.get(
    "/ScientificProgression/AdministrativePosition",
    {
      params: {
        pageIndex: page,
        pageSize,
        search,
        ...(sort && { sort }),
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      skipGlobalErrorHandler: true,
    },
  );

  return res.data;
};

export const deleteAdminPosition = async (id) => {
  await axiosInstance.delete(
    `/ScientificProgression/DeleteAdministrativePosition/${id}}`,
    { skipGlobalErrorHandler: true },
  );
};
export const adminPositionService = {
  create: (data) => 
    axiosInstance.post("/ScientificProgression/CreateAdministrativePosition", data, { skipGlobalErrorHandler: true }),
  
  update: (id, data) => 
    axiosInstance.put(`/ScientificProgression/UpdateAdministrativePosition/${id}`, { id, ...data }, { skipGlobalErrorHandler: true }),
};