import { useState, useEffect } from "react";
import {
  conferenceService,
  uploadSeminarAttachments,
  deleteSeminarAttachment,
} from "../services/seminarsAndConferences.service";

export default function useConferenceForm(initialData) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    type: 2,
    localOrInternational: 1,
    name: "",
    roleOfParticipationId: "",
    organizingAuthority: "",
    website: "",
    venue: "",
    notes: "",
    startDate: "",
    endDate: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);

  // =====================
  // FETCH ROLES + INIT
  // =====================
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await conferenceService.getRoles();
        setRoles(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoles();

    if (initialData) {
      setFormData({
        type: initialData.type === "Conference" ? 2 : 1,
        localOrInternational:
          initialData.localOrInternational === "Local" ? 1 : 2,
        name: initialData.name || "",
        roleOfParticipationId:
          initialData.roleOfParticipation?.id || "",
        organizingAuthority:
          initialData.organizingAuthority || "",
        website: initialData.website || "",
        venue: initialData.venue || "",
        notes: initialData.notes || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
      });

      // Normalize attachments
      setAttachments(
        (initialData.attachments || []).map((file) => ({
          id: file.id,
          name: file.fileName,
          fileName: file.fileName,
          size: file.size,
          type: file.contentType,
          isExisting: true,
        }))
      );
    }
  }, [initialData]);

  // =====================
  // MARK ATTACHMENT FOR DELETION
  // =====================
  const markAttachmentForDeletion = (file) => {
    // Remove from UI
    setAttachments((prev) =>
      prev.filter((f) =>
        f.isExisting
          ? f.id !== file.id
          : f.name !== file.name
      )
    );

    // Add to deletion list if exists on server
    if (file.isExisting && file.id) {
      setDeletedAttachmentIds((prev) => {
        if (prev.includes(file.id)) return prev;
        return [...prev, file.id];
      });
    }
  };

  // =====================
  // SAVE FUNCTION
  // =====================
  const save = async (id = null) => {
    setLoading(true);

    try {
      const payload = {
        ...formData,
        type: formData.type === 2 ? "Conference" : "Seminar",
        localOrInternational:
          formData.localOrInternational === 1
            ? "Local"
            : "International",
      };

      let response;

      if (id) {
        response = await conferenceService.update(id, payload);
      } else {
        response = await conferenceService.create(payload);
      }

      const entityId = id || response?.data?.id || response?.id;

      if (!entityId) throw new Error("Entity ID not found");

      // 🔥 Delete attachments marked for deletion
      if (deletedAttachmentIds.length > 0) {
        await Promise.all(
          deletedAttachmentIds.map((attachmentId) =>
            deleteSeminarAttachment(entityId, attachmentId)
          )
        );
      }

      // 🔥 Upload new attachments
      const newFiles = attachments.filter((f) => !f.isExisting);

      if (newFiles.length > 0) {
        await uploadSeminarAttachments(entityId, newFiles);
      }

      return true;
    } catch (err) {
      console.error("Save error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    roles,
    loading,
    save,
    attachments,
    setAttachments,
    markAttachmentForDeletion,
  };
}