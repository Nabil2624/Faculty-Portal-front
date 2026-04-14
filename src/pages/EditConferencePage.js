import React from "react";
import { Edit3, Mic, Mic2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ConferenceForm from "../components/widgets/SeminarAndConferences/ConferenceForm";

export default function EditConferencePage() {
  const { t } = useTranslation("add-conference");
  const location = useLocation();
  const itemData = location.state?.item; // البيانات اللي جاية من الجدول

  return (
    <ConferenceForm 
      pageTitle={t("editConference")} 
      pageIcon={Mic2} 
      initialData={itemData}
      isEdit={true}
    />
  );
}