import axiosInstance from "../utils/axiosInstance";


export const replaceProfilePicture = (entityId, oldAttachmentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.put(
    `/Attachments/${entityId}/${oldAttachmentId}?context=3`,
    formData
  );
};