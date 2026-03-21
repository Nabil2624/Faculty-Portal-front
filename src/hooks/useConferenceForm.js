import { useState, useEffect } from "react";
import { conferenceService } from "../services/seminarsAndConferences.service";

export default function useConferenceForm(initialData) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    type: 2, // Default to Conference (2)
    localOrInternational: 1, // Default to Local (1)
    name: "",
    roleOfParticipationId: "",
    organizingAuthority: "",
    website: "", // إضافة الموقع الإلكتروني
    venue: "",   // إضافة المدينة/المكان
    notes: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await conferenceService.getRoles();
        setRoles(res.data || []);
      } catch (err) { console.error(err); }
    };
    fetchRoles();

    if (initialData) {
      setFormData({
        type: initialData.type === "Conference" ? 2 : 1,
        localOrInternational: initialData.localOrInternational === "Local" ? 1 : 2,
        name: initialData.name || "",
        roleOfParticipationId: initialData.roleOfParticipationId || initialData.roleOfParticipation?.id || "",
        organizingAuthority: initialData.organizingAuthority || "",
        website: initialData.website || "",
        venue: initialData.venue || "",
        notes: initialData.notes || "",
        startDate: initialData.startDate?.split("T")[0] || "",
        endDate: initialData.endDate?.split("T")[0] || "",
      });
    }
  }, [initialData]);

  const save = async (id = null, attachments = []) => {
    setLoading(true);
    try {
      // تحويل القيم الرقمية لنصوص إذا كان الـ API يتوقع نصوصاً مثل الكود القديم
      const payload = {
        ...formData,
        type: formData.type === 2 ? "Conference" : "Seminar",
        localOrInternational: formData.localOrInternational === 1 ? "Local" : "International",
      };

      let response;
      if (id) {
        response = await conferenceService.update(id, payload);
      } else {
        response = await conferenceService.create(payload);
      }

      // معالجة المرفقات إذا وجدت
      const entityId = id || response?.id || response?.data?.id;
      if (attachments.length > 0 && entityId) {
        const formDataObj = new FormData();
        attachments.forEach((file) => formDataObj.append("files", file));
        // هنا يمكنك استدعاء سيرفس المرفقات
        // await attachmentService.upload(entityId, 8, formDataObj);
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, roles, loading, save };
}