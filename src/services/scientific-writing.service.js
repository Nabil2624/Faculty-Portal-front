import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getScientificWriting = (
  pageIndex,
  pageSize,
  search,
  AuthorRoleIds,
  sort,
) => {
  return axiosInstance.get("/WritingsAndPatents/ScientificWritings", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(AuthorRoleIds?.length && { AuthorRoleIds }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
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
