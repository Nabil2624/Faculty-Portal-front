import { useState } from "react";
import { articleService } from "../services/articleReview.service";

// Hook للإضافة
export const useAddArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addArticle = async (data) => {
    setLoading(true);
    try {
      const res = await articleService.create(data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { addArticle, loading, error };
};

// Hook للتعديل
export const useUpdateArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateArticle = async (id, data) => {
    setLoading(true);
    try {
      const res = await articleService.update(id, data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { updateArticle, loading, error };
};