import axiosInstance from "../utils/axiosInstance";

export const getArticleReviews = async (page, pageSize) => {
  const response = await axiosInstance.get("/ProjectsAndCommittees/ReviewingArticles", {
    params: { pageIndex: page, pageSize },
    skipGlobalErrorHandler: true,
  });
  return response.data; // { data, totalCount }
};

export const deleteArticleReview = async (id) => {
  await axiosInstance.delete(`/ProjectsAndCommittees/DeleteReviewingArticle/${id}`, {
    skipGlobalErrorHandler: true,
  });
};
