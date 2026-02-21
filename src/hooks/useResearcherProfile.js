// import { useState, useEffect } from "react";
// import { getResearcherProfile } from "../services/researcherProfileService";

// export default function useResearcherProfile() {
//   const [researcher, setResearcher] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     getResearcherProfile()
//       .then((data) => {
//         setResearcher(data);
//         setError(null);
//       })
//       .catch((err) => setError(err.message || "Error fetching data"))
//       .finally(() => setLoading(false));
//   }, []);

//   return { researcher, loading, error };
// }


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { getResearcherProfile } from "../services/researcherProfileService";

// export default function useResearcherProfile(nationalNumber) {
//   const [researcher, setResearcher] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [waiting, setWaiting] = useState(false);
//   const [missingScholar, setMissingScholar] = useState(false);

//   useEffect(() => {
//     const loadProfile = async () => {
//       setLoading(true);

//       try {
//         const data = await getResearcherProfile();
//         setResearcher(data);
//         setLoading(false);
//       } catch (err) {
//         if (err.response?.status === 204) {
//           try {
//             const response = await axios.get(
//               "http://127.0.0.1:8000/api/fetch-researcher-links/",
//               {
//                 params: {
//                   national_number: nationalNumber,
//                 },
//               }
//             );

//             if (response.status === 200) {
//               setWaiting(true);
//             }
//           } catch (err2) {
//             if (err2.response?.status === 404) {
//               setMissingScholar(true);
//             }
//           }

//           setLoading(false);
//         } else {
//           setError("Error fetching data");
//           setLoading(false);
//         }
//       }
//     };

//     loadProfile();
//   }, [nationalNumber]);

//   return { researcher, loading, error, waiting, missingScholar };
// }



import { useState, useEffect } from "react";
import axios from "axios";
import { getResearcherProfile } from "../services/researcherProfileService";

export default function useResearcherProfile(nationalNumber) {
  const [researcher, setResearcher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [missingScholar, setMissingScholar] = useState(false);

  useEffect(() => {
    let pollingInterval = null; // 👈 نحتفظ بالـ interval

    const loadProfile = async () => {
      setLoading(true);

      try {
        const data = await getResearcherProfile();
        setResearcher(data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 204) {
          try {
            const response = await axios.get(
              "http://127.0.0.1:8000/api/fetch-researcher-links/",
              {
                params: { national_number: nationalNumber },
              }
            );

            if (response.status === 200) {
              setWaiting(true); // 🟡 بدأنا ننتظر
            }
          } catch (err2) {
            if (err2.response?.status === 404) {
              setMissingScholar(true);
            }
          }

          setLoading(false);
        } else {
          setError("Error fetching data");
          setLoading(false);
        }
      }
    };

    loadProfile();

    // ================= POLLING =================
    if (waiting) {
      pollingInterval = setInterval(async () => {
        try {
          const data = await getResearcherProfile();
          if (data) {
            setResearcher(data);
            setWaiting(false);
            clearInterval(pollingInterval);
          }
        } catch {
          // لسه البيانات مش جاهزة، نكمل polling
        }
      }, 5000); // كل 5 ثواني
    }

    // Cleanup: لما المكون unmount أو waiting يتغير
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [nationalNumber, waiting]); // 👈 أضفنا waiting dependency

  return { researcher, loading, error, waiting, missingScholar };
}
