import React from "react";
import { useNavigate } from "react-router-dom";
import JournalForm from "../components/widgets/ParticipationJournals/JournalForm";

export default function AddJournalPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/journals"); 
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <JournalForm 
      onSuccess={handleSuccess} 
      onCancel={handleCancel} 
    />
  );
}