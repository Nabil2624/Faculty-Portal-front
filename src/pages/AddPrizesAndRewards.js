import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";
import PrizesAndRewardsForm from "../components/widgets/PrizesAndRewards/PrizesAndRewardsForm";
import usePrizesAndRewardsForm from "../hooks/usePrizeAndRewardsForm";
import LoadingSpinner from "../components/LoadingSpinner";

import { getLookupsRewards } from "../services/prizesAndRewards.service";
import { createPrizeOrReward } from "../services/prizesAndRewards.service";

export default function AddPrizesAndRewards() {
  const { t, i18n } = useTranslation("prizes-and-rewards-form");
  const isArabic = i18n.language === "ar";
  const dir = i18n.dir();
  const navigate = useNavigate();

  const {
    form,
    setForm,
    errors,
    validate,
    setServerErrors,
    attachments, // <-- add this
    setAttachments, // <-- add this
    handleSave, // <-- add this
    loading, // <-- optional, if you want loading spinner
  } = usePrizesAndRewardsForm(t);

  // const [loading, setLoading] = useState(false);
  const [prizesOptions, setPrizesOptions] = useState([]);

  // load prize options from lookups
  useEffect(() => {
    getLookupsRewards().then((res) => {
      setPrizesOptions(res.data || []);
    });
  }, []);

  // const handleSave = async () => {
  //   if (!validate()) return;

  //   setLoading(true);
  //   try {
  //     await createPrizeOrReward(form);
  //     navigate("/prizes-and-rewards");
  //   } catch (error) {
  //     setServerErrors(
  //       error.response?.data || { message: t("messages.failedSave") },
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveLayoutProvider>
      <div dir={dir}>
        <PrizesAndRewardsForm
          title={t("titles.addPrizeOrReward")}
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
          attachments={attachments} // <-- pass attachments
          setAttachments={setAttachments} // <-- pass setter
          error={errors}
          onSave={() => handleSave(navigate)}
          onCancel={() => navigate("/prizes-and-rewards")}
        />
      </div>
    </ResponsiveLayoutProvider>
  );
}
