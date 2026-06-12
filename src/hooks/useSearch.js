import { useState, useEffect } from "react";
import { getUsers } from "../services/global.service";



export default function useSearch(searchTerm) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(searchTerm);

        setUsers(response || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm]);


  return { users, loading, error };
}
