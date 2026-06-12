import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

export default function ProfileImage({ user }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.profilePicture?.id) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchImage = async () => {
      try {
        const url = `/Attachments/${user.personalDataId}/${user.profilePicture.id}?context=3`;
        const response = await axiosInstance.get(url, { responseType: "blob" });
        if (isMounted) {
          const imageUrl = URL.createObjectURL(response.data);
          setImage(imageUrl);
        }
      } catch (err) {
        console.error("Error loading image", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();
    return () => {
      isMounted = false;
      if (image) URL.revokeObjectURL(image);
    };
  }, [user]);

  return (
    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
      {loading ? (
        <div className="w-full h-full animate-pulse bg-white/5" />
      ) : image ? (
        <img src={image} alt={user.facultyMemberName} className="w-full h-full object-cover" />
      ) : (
        <User className="w-5 h-5 text-white/50" />
      )}
    </div>
  );
}