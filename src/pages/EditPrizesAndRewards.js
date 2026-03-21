import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import PrizesAndRewardsForm from "../components/widgets/PrizesAndRewards/PrizesAndRewardsForm";

import usePrizesAndRewardsForm from "../hooks/usePrizeAndRewardsForm";
import { updatePrizeOrReward } from "../services/prizesAndRewards.service";
import { getLookupsRewards } from "../services/prizesAndRewards.service";
import {
  uploadPrizeAttachments,
  deletePrizeAttachment,
} from "../services/prizesAndRewards.service";

export default function EditPrizesAndRewards() {
  const { t, i18n } = useTranslation("prizes-and-rewards-form");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const [prizesOptions, setPrizesOptions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state?.item;

  // Redirect if page opened without state
  useEffect(() => {
    if (!item) {
      navigate("/prizes-and-rewards", { replace: true });
    }
  }, [item, navigate]);

  const {
    form,
    setForm,
    errors,
    validate,
    setServerErrors,
    attachments,
    setAttachments,
  } = usePrizesAndRewardsForm(t, item);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        prizeId: form.prizeId,
        awardingAuthority: form.awardingAuthority.trim(),
        dateReceived: form.dateReceived,
        description: form.description?.trim() || null,
      };

      await updatePrizeOrReward(item.id, payload);

      // =============================
      // Attachment diff
      // =============================

      const existingIds = (item.attachments || []).map((a) => a.id);
      const currentExistingIds = attachments
        .filter((a) => a.isExisting)
        .map((a) => a.id);

      // Deleted attachments
      const deletedIds = existingIds.filter(
        (id) => !currentExistingIds.includes(id),
      );

      // New attachments
      const newFiles = attachments.filter((a) => !a.isExisting);

      // =============================
      //  DELETE
      // =============================
      for (const id of deletedIds) {
        await deletePrizeAttachment(item.id, id);
      }

      // =============================
      //  UPLOAD
      // =============================
      if (newFiles.length > 0) {
        await uploadPrizeAttachments(item.id, newFiles);
      }

      navigate("/prizes-and-rewards");
    } catch (error) {
      setServerErrors({ message: t("messages.failedSave") });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLookupsRewards().then((res) => {
      setPrizesOptions(res.data || []);
    });
  }, []);

  if (!item) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <PrizesAndRewardsForm
          title={t("titles.editPrizeOrReward")}
          t={t}
          isArabic={isArabic}
          prizesOptions={prizesOptions}
          prizeId={form.prizeId}
          setPrizeId={(v) => setForm({ ...form, prizeId: v })}
          awardingAuthority={form.awardingAuthority}
          setAwardingAuthority={(v) =>
            setForm({ ...form, awardingAuthority: v })
          }
          dateReceived={form.dateReceived}
          setDateReceived={(v) => setForm({ ...form, dateReceived: v })}
          description={form.description}
          setDescription={(v) => setForm({ ...form, description: v })}
          attachments={attachments}
          setAttachments={setAttachments}
          error={errors}
          onSave={handleSave}
          onCancel={() => navigate("/prizes-and-rewards")}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
