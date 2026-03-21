import React from "react";
import { Mic, Mic2, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConferenceForm from "../components/widgets/SeminarAndConferences/ConferenceForm";

export default function AddConferencePage() {
  const { t } = useTranslation("add-conference");

  return (
    <ConferenceForm 
      pageTitle={t("addConference")} 
      pageIcon={Mic2} 
      isEdit={false}
      t={t}
    />
  );
}