import React from "react";
import ArticleForm from "../components/widgets/ArticleReview/ArticleForm"; // الفورم الموحدة

export default function AddArticlePage() {
  const handleSuccess = (data) => {
    console.log("تمت الإضافة بنجاح:", data);
  };

  const handleCancel = () => {
    // ممكن ترجع لورا في الـ history
    window.history.back();
  };

  return (
    <ArticleForm 
      onSuccess={handleSuccess} 
      onCancel={handleCancel} 
    />
  );
}