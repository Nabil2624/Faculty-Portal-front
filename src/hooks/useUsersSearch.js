import { useState, useEffect } from "react";
import { getUsersSearch } from "../services/global.service";

export default function useUsersSearch(searchTerm, Take) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsersSearch(searchTerm, Take);
        
        // نفترض أن response هو مصفوفة اليوزرز
        const data = response || [];
        
        setUsers(data);
        
        // المنطق: لو عدد الداتا اللي راجعة يساوي الـ Take 
        // يبقى غالباً لسه في داتا تانية في السيرفر
        setHasMore(data.length >= Take && data.length > 0);
        
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, Take]); 

  return { users, loading, error, hasMore };
}