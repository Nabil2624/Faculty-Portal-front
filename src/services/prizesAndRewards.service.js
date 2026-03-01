import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getPrizesAndRewards = (
  pageIndex,
  pageSize,
  search,
  sort,
  PrizeIds,
) => {
  return axiosInstance.get("/Prizes/PrizesAndRewards", {
    params: {
      pageIndex,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(PrizeIds?.length && { PrizeIds }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });
};

export const deletePrizeOrReward = (id) => {
  return axiosInstance.delete(`/Prizes/DeletePrizeOrReward/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
export const createPrizeOrReward = (data) => {
  return axiosInstance.post("/Prizes/CreatePrizeOrReward", data, {
    skipGlobalErrorHandler: true,
  });
};

export const getLookupsRewards = () => {
  return axiosInstance.get("/LookUpItems/Rewards", {
    skipGlobalErrorHandler: true,
  });
};
// Update
export const updatePrizeOrReward = (id, data) => {
  return axiosInstance.put(`/Prizes/UpdatePrizeOrReward/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
};
