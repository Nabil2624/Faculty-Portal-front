import { useState, useEffect, useCallback } from "react";
import {
  adminGetPersonalData,
  adminUpdatePersonalData,
  adminGetAdminContactData,
  adminUpdateAdminContactData,
  adminGetIdentificationCard,
  adminUpdateIdentificationCard,
  adminGetAdminSocialMediaPlatforms,
  adminUpdateAdminSocialMediaPlatforms,
  adminGetTitlesLookup,
  adminGetGendersLookup,
  adminGetSocialStatesLookup,
  adminGetUniversitiesLookup,
  adminGetDepartmentsLookup,
  adminGetStudyFieldsLookup,
  adminGetFacultiesLookup,
} from "../services/adminFacultyData.service";

export default function useAdminPersonalData(email) {
  const [personalData, setPersonalData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [identificationData, setIdentificationData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lookups
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [socialStates, setSocialStates] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [studyFields, setStudyFields] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const load = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const [
        personalRes,
        contactRes,
        identRes,
        socialRes,
        titlesRes,
        gendersRes,
        socialStatesRes,
        universitiesRes,
        departmentsRes,
        studyFieldsRes,
        facultiesRes,
      ] = await Promise.all([
        adminGetPersonalData(email).catch(() => null),
        adminGetAdminContactData(email).catch(() => null),
        adminGetIdentificationCard(email).catch(() => null),
        adminGetAdminSocialMediaPlatforms(email).catch(() => null),
        adminGetTitlesLookup().catch(() => null),
        adminGetGendersLookup().catch(() => null),
        adminGetSocialStatesLookup().catch(() => null),
        adminGetUniversitiesLookup().catch(() => null),
        adminGetDepartmentsLookup().catch(() => null),
        adminGetStudyFieldsLookup().catch(() => null),
        adminGetFacultiesLookup().catch(() => null),
      ]);

      setPersonalData(personalRes?.data || {});
      setContactData(contactRes?.data || {});
      setIdentificationData(identRes?.data || {});
      setSocialData(socialRes?.data || {});
      setTitles(Array.isArray(titlesRes?.data) ? titlesRes.data : []);
      setGenders(Array.isArray(gendersRes?.data) ? gendersRes.data : []);
      setSocialStates(
        Array.isArray(socialStatesRes?.data) ? socialStatesRes.data : [],
      );
      setUniversities(
        Array.isArray(universitiesRes?.data) ? universitiesRes.data : [],
      );
      setDepartments(
        Array.isArray(departmentsRes?.data) ? departmentsRes.data : [],
      );
      setStudyFields(
        Array.isArray(studyFieldsRes?.data) ? studyFieldsRes.data : [],
      );
      setFaculties(Array.isArray(facultiesRes?.data) ? facultiesRes.data : []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    load();
  }, [load]);

  const savePersonal = useCallback(
    async (data) => {
      setSaving(true);
      setSaveError(null);
      try {
        const res = await adminUpdatePersonalData(email, data);
        setPersonalData(res?.data || data);
      } catch (e) {
        setSaveError(e);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [email],
  );

  const saveContact = useCallback(
    async (data) => {
      setSaving(true);
      setSaveError(null);
      try {
        await adminUpdateAdminContactData(email, data);
        setContactData((prev) => ({ ...prev, ...data }));
      } catch (e) {
        setSaveError(e);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [email],
  );

  const saveIdentification = useCallback(
    async (data) => {
      setSaving(true);
      setSaveError(null);
      try {
        await adminUpdateIdentificationCard(email, data);
        setIdentificationData((prev) => ({ ...prev, ...data }));
      } catch (e) {
        setSaveError(e);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [email],
  );

  const saveSocial = useCallback(
    async (data) => {
      setSaving(true);
      setSaveError(null);
      try {
        await adminUpdateAdminSocialMediaPlatforms(email, data);
        setSocialData((prev) => ({ ...prev, ...data }));
      } catch (e) {
        setSaveError(e);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [email],
  );

  return {
    personalData,
    contactData,
    identificationData,
    socialData,
    loading,
    error,
    saving,
    saveError,
    reload: load,
    savePersonal,
    saveContact,
    saveIdentification,
    saveSocial,
    lookups: {
      titles,
      genders,
      socialStates,
      universities,
      departments,
      studyFields,
      faculties,
    },
  };
}
