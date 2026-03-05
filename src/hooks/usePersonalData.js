import { useState, useEffect } from "react";
import {
  getPersonalData,
  getContactData,
  getSocialData,
  getIdentificationData,
} from "../services/facultyMember.service";

export default function usePersonalData() {
  const [personalData, setPersonalData] = useState({});
  const [contactData, setContactData] = useState({});
  const [socialData, setSocialData] = useState({});
  const [identificationData, setIdentificationData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [personalRes, contactRes, socialRes, identificationRes] = await Promise.all([
          getPersonalData().catch((e) => (e.response?.status === 404 ? {} : console.error(e))),
          getContactData().catch((e) => (e.response?.status === 404 ? {} : console.error(e))),
          getSocialData().catch((e) => (e.response?.status === 404 ? {} : console.error(e))),
          getIdentificationData().catch((e) => (e.response?.status === 404 ? {} : console.error(e))),
        ]);

        setPersonalData(personalRes?.data || {});
        setContactData(contactRes?.data || {});
        setSocialData(socialRes?.data || {});
        setIdentificationData(identificationRes?.data || {});
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { personalData, contactData, socialData, identificationData, loading };
}