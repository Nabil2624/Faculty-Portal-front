// services/trainingPrograms.service.js
import axiosInstance from "../utils/axiosInstance";

export const getTrainingPrograms = async ({
  page,
  pageSize,
  search,
}) => {
  const response = await axiosInstance.get("/Missions/TrainingPrograms", {
    params: {
      page,
      pageSize,
      search,
    },
    skipGlobalErrorHandler: true,
  });

  return response.data;
};
export const deleteTrainingProgram = (id ) => {
  return axiosInstance.delete(`/Missions/DeleteTrainingProgram/${id}`,
     {
    skipGlobalErrorHandler: true,
  });
};
