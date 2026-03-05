import axiosInstance from "../utils/axiosInstance";

export const getPersonalData = () =>
  axiosInstance.get("/FacultyMemberData/PersonalData", { skipGlobalErrorHandler: true });

export const getContactData = () =>
  axiosInstance.get("/FacultyMemberData/ContactData", { skipGlobalErrorHandler: true });

export const getSocialData = () =>
  axiosInstance.get("/FacultyMemberData/SocialMediaPlatforms", { skipGlobalErrorHandler: true });

export const getIdentificationData = () =>
  axiosInstance.get("/FacultyMemberData/IdentificationCard", { skipGlobalErrorHandler: true });