import axiosInstance from "../utils/axiosInstance";

export const getAdminPosition = async ({ page, pageSize, search }) => {
  const res = await axiosInstance.get("/ScientificProgression/AdministrativePosition", {
    params: {
      pageIndex: page,
      pageSize,
      search,
    },
  });

  return res.data;
};

export const deleteAdminPosition= async (id) => {
  await axiosInstance.delete(`/ScientificProgression/DeleteAdministrativePosition/${id}}`);
};
