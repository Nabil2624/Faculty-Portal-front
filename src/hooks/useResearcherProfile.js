

import { useState, useEffect } from "react";
import axios from "axios";
import { getResearcherProfile } from "../services/researcherProfileService";
import { getCurrentUser } from "../services/auth.service";

export default function useResearcherProfile() {
  const [researcher, setResearcher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [missingScholar, setMissingScholar] = useState(false);
  const [nationalNumber, setNationalNumber] = useState(null);

  // First load
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      setMissingScholar(false);
      setWaiting(false);

      try {
        // Get current user
        const userResponse = await getCurrentUser();
        const currentNationalNumber = userResponse.data.nationalNumber;
        setNationalNumber(currentNationalNumber);

        // Get researcher profile
        const response = await getResearcherProfile();

        if (response.status === 200) {
          setResearcher(response.data);
          setLoading(false);
          return;
        }

        if (response.status === 204) {
          try {
            const linksResponse = await axios.get(
              "http://127.0.0.1:8000/api/fetch-researcher-links/",
              {
                params: { national_number: currentNationalNumber },
              }
            );

            if (linksResponse.status === 200) {
              // Python started scraping
              setWaiting(true);
            }
          } catch (err) {
            if (err.response?.status === 404) {
              setMissingScholar(true);
            } else {
              setError("Error fetching researcher links");
            }
          }

          setLoading(false);
        }
      } catch (err) {
        setError("Error fetching profile");
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Polling when waiting is true
  useEffect(() => {
    if (!waiting || !nationalNumber) return;

    const interval = setInterval(async () => {
      try {
        const response = await getResearcherProfile();

        if (response.status === 200) {
          setResearcher(response.data);
          setWaiting(false);
          clearInterval(interval);
        }
      } catch (err) {
        // ignore errors until backend finishes
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [waiting, nationalNumber]);

  return {
    researcher,
    loading,
    error,
    waiting,
    missingScholar,
    nationalNumber,
  };
}