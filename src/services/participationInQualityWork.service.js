import axiosInstance from "../utils/axiosInstance";

export const getParticipation = (pageIndex, pageSize) => {
  return axiosInstance.get("/Contributions/ParticipationsInQualityWorks", {
    params: { pageIndex, pageSize },
    skipGlobalErrorHandler: true,
  });
}
export const createParticipation = (data) => {
  return axiosInstance.post("/Contributions/CreateParticipationInQualityWorks", data, {
    skipGlobalErrorHandler: true,
  });
};
export const updateParticipation = (id , data) => {
  return axiosInstance.put(`/Contributions/UpdateParticipationInQualityWorks/${id}`, data, {
    skipGlobalErrorHandler: true,
  });
}
export const deleteParticipation = (id ) => {
  return axiosInstance.delete(`/Contributions/DeleteParticipationInQualityWorks/${id}`,
     {
    skipGlobalErrorHandler: true,
  });
};


