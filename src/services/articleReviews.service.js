import axiosInstance from "../utils/axiosInstance";
import qs from "qs";
export const getArticleReviews = async (page, pageSize, search, sort) => {
  const response = await axiosInstance.get(
    "/ProjectsAndCommittees/ReviewingArticles",
    {
      params: {
        pageIndex:page,
        pageSize,
        search,
        ...(sort && { sort }),
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      skipGlobalErrorHandler: true,
    },
  );
  return response.data; // { data, totalCount }
};

export const deleteArticleReview = async (id) => {
  await axiosInstance.delete(
    `/ProjectsAndCommittees/DeleteReviewingArticle/${id}`,
    {
      skipGlobalErrorHandler: true,
    },
  );
};
