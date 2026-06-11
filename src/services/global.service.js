import axiosInstance from "../utils/axiosInstance";

export const getUsers = async (searchTerm) => {
  const res = await axiosInstance.get(
    "/FacultyMemberPublicProfile/Profiles/Search",
    {
      params: {
        Search: searchTerm,
      },
      skipGlobalErrorHandler: true,
    },
  );

  return res.data;
};
export const getUsersSearch = async (searchTerm, Take) => {
  const res = await axiosInstance.get("/FacultyMemberPublicProfile/Profiles", {
    params: {
      Search: searchTerm,
      Take: Take,
    },
    skipGlobalErrorHandler: true,
  });

  return res.data;
};
export const getProfile = async (facultyMemberId) => {
  const res = await axiosInstance.get(
    `/FacultyMemberPublicProfile/Profile/${facultyMemberId}`,
    { skipGlobalErrorHandler: true },
  );

  return res.data;
};
export const getCV = async (facultyMemberId) => {
  const res = await axiosInstance.get(`/CV/Download-Pdf`, {
    skipGlobalErrorHandler: true,
  });

  return res.data;
};
