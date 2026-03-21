import axiosInstance from "../utils/axiosInstance";

export const handleProfilePictureUpload = (entityId, oldAttachmentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  if (oldAttachmentId) {
    // تحديث صورة موجودة مسبقاً
    return axiosInstance.put(
      `/Attachments/${entityId}/${oldAttachmentId}?context=3`,
      formData
    );
  } else {
    // رفع صورة لأول مرة
    return axiosInstance.post(
      `/Attachments/${entityId}?context=3`,
      formData
    );
  }
};