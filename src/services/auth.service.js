import axiosInstance from "../utils/axiosInstance";

// 1. التأكد من حالة السيشن (الـ Endpoint اللي بتعرفنا السيشن لسه عايشة ولا ماتت)
export const checkAuthMe = async () => {
  return await axiosInstance.get("/Authentication/AuthMe");
};

// 2. جلب بيانات المستخدم الحالي (بترجع الـ Object اللي فيه الاسم، الـ Role، إلخ)
export const getCurrentUser = async () => {
  return await axiosInstance.get("/Authentication/GetCurrentUser");
};

// 3. تسجيل الخروج (بتمسح الـ Cookie من السيرفر)
export const logout = async () => {
  return await axiosInstance.post("/Authentication/Logout");
};