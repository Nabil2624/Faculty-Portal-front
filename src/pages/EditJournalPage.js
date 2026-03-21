import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JournalForm from "../components/widgets/ParticipationJournals/JournalForm";

export default function EditJournalPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // البيانات اللي جاية من صفحة الجدول
  const itemToEdit = state?.item;

  const handleSuccess = () => {

    navigate("/journals");
  };

  // لو مفيش داتا (مثلاً عمل ريفريش) يرجع لصفحة الجدول
//   if (!itemToEdit) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <p className="mb-4 text-gray-600">عفواً، لم يتم العثور على بيانات للتعديل</p>
//         <button 
//           onClick={() => navigate("/journals-list")}
//           className="bg-[#b38e19] text-white px-4 py-2 rounded"
//         >
//           العودة للقائمة
//         </button>
//       </div>
//     );
//   }

  return (
    <JournalForm 
      item={itemToEdit} 
      onSuccess={handleSuccess} 
      onCancel={() => navigate(-1)} 
    />
  );
}