// import { useEffect, useState } from "react";
// import {
//   fetchScientificResearchById,
//   updateScientificResearch,
// } from "../services/scientificResearchService";

// export function useEditScientificResearch(researchId) {
//   const [loading, setLoading] = useState(true);

//   const [abstract, setAbstract] = useState("");
//   const [researchTitle, setResearchTitle] = useState("");
//   const [participants, setParticipants] = useState([]);

//   const [form, setForm] = useState({
//     journalOrConference: "",
//     issue: "",
//     pages: "",
//     researchLink: "",
//     year: "",
//     relatedResearch: "",
//   });

//   useEffect(() => {
//     async function loadData() {
//       setLoading(true);
//       const data = await fetchScientificResearchById(researchId);

//       setAbstract(data.abstract);
//       setResearchTitle(data.researchTitle);
//       setParticipants(data.participants);

//       setForm({
//         journalOrConference: data.journalOrConference,
//         issue: data.issue,
//         pages: data.pages,
//         researchLink: data.researchLink,
//         year: data.year,
//         relatedResearch: data.relatedResearch,
//       });

//       setLoading(false);
//     }

//     loadData();
//   }, [researchId]);

//   function handleChange(key, value) {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   }

//   async function handleSave() {
//     const payload = {
//       ...form,
//       abstract,
//       researchTitle,
//       participants,
//     };

//     await updateScientificResearch(researchId, payload);
//   }

//   return {
//     loading,

//     abstract,
//     setAbstract,

//     researchTitle,
//     setResearchTitle,

//     participants,
//     setParticipants,

//     form,
//     handleChange,

//     handleSave,
//   };
// }
