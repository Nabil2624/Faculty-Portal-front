import { useState, useEffect } from "react";
import { getProfile } from "../services/global.service";


export default function useProfilePage(facultyMemberId) {
  const [profile, setprofile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getProfile(facultyMemberId);

        setprofile(response || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  return { profile, loading, error };
}
