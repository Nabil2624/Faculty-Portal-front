import axiosInstance from "../utils/axiosInstance";
export const getUserNotifications = async (Take) => {
  const res = await axiosInstance.get("/Notification/UserNotifications", {
    params: {
      Take: Take,
    },
  });

  return res.data;
};
