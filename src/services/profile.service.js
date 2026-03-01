// services/profile.service.js
import axiosInstance from "../utils/axiosInstance";

// ================= Get Profile =================
export const getProfile = async () => {
  return await axiosInstance.get("/ProfileDashboard/Profile", {
    skipGlobalErrorHandler: true,
  });
};

// ================= Update Skills =================
export const updateSkills = async (skills) => {
  const payload = {
    skills: skills.map((s) => s.text),
  };

  return await axiosInstance.put("/ProfileDashboard/UpdateSkills", payload, {
    skipGlobalErrorHandler: true,
  });
};
// ================= Update Bio Summary =================
export const updateBioSummary = async (bioSummary) => {
  const payload = { bioSummary };

  return await axiosInstance.put(
    "/ProfileDashboard/UpdateBioSummary",
    payload,
    { skipGlobalErrorHandler: true },
  );
};
