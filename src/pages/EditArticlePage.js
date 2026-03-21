import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleForm from "../components/widgets/ArticleReview/ArticleForm";

export default function EditArticlePage() {
  const { state } = useLocation(); // بناخد البيانات اللي مبعوتة في الـ Route
  const navigate = useNavigate();

  // "item" هو الكائن اللي فيه id, titleOfArticle, authority, إلخ...
  const itemToEdit = state?.item; 

  const handleSuccess = () => {
    navigate("/article-reviews");
  };



  return (
    <ArticleForm 
      item={itemToEdit} 
      onSuccess={handleSuccess} 
      onCancel={() => navigate(-1)} 
    />
  );
}