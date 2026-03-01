// services/trainingPrograms.service.js
import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getTrainingPrograms = async ({
  page,
  pageSize,
  search,
  TrainingProgramTypes,
  TrainingProgramParticipationTypes,
  sort,
}) => {
  const response = await axiosInstance.get("/Missions/TrainingPrograms", {
    params: {
      page,
      pageSize,
      search,
      ...(sort && { sort }),
      ...(TrainingProgramTypes?.length && { TrainingProgramTypes }),
      ...(TrainingProgramParticipationTypes?.length && { TrainingProgramParticipationTypes }),
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    skipGlobalErrorHandler: true,
  });

  return response.data;
};
export const deleteTrainingProgram = (id) => {
  return axiosInstance.delete(`/Missions/DeleteTrainingProgram/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
