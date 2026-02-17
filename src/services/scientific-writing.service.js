import axiosInstance from "../utils/axiosInstance";

export const getScientificWriting = (pageIndex, pageSize) => {
  return axiosInstance.get("/WritingsAndPatents/ScientificWritings", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
};
export const createScientificWriting = (data) => {
  return axiosInstance.post(
    "/WritingsAndPatents/CreateScientificWriting",
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const updateScientificWriting = (id, data) => {
  return axiosInstance.put(
    `WritingsAndPatents/UpdateScientificWriting/${id}`,
    data,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const deleteScientificWriting = (id) => {
  return axiosInstance.delete(
    `WritingsAndPatents/DeleteScientificWriting/${id}`,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
export const getAuthorRole = () => {
  return axiosInstance.get("/LookUpItems/AuthorRoles", {
    skipGlobalErrorHandler: true,
  });
};
