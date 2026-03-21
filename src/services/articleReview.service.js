import axiosInstance from "../utils/axiosInstance";

export const articleService = {
  create: (data) => axiosInstance.post("/ProjectsAndCommittees/CreateReviewingArticle", data, { skipGlobalErrorHandler: true }),
  update: (id, data) => axiosInstance.put(`/ProjectsAndCommittees/UpdateReviewingArticle/${id}`, data, { skipGlobalErrorHandler: true }),
};