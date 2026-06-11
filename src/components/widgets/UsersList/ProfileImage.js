import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

export default function ProfileImage({ user, className = "w-10 h-10" }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.profilePicture?.id) {
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
    <div className={`rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200/50 ${className}`}>
      {loading ? (
        <div className="w-full h-full animate-pulse bg-gray-200" />
      ) : image ? (
        <img src={image} alt={user.facultyMemberName} className="w-full h-full object-cover" />
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
}