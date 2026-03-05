import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import subPicture from "../assets/prof.jpg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import { Descriptions, Flex } from "antd";
import { createStaticStyles } from "antd-style";

export default function PersonalDataPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPersonalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        "/FacultyMemberData/PersonalData",
        { skipGlobalErrorHandler: true },
      );
      setPersonalData(response.data || {});
    } catch (err) {
      console.error("Failed to fetch personal data:", err);
      setPersonalData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const getValue = (obj) => {
    if (!obj || obj === "") return t("none");
    if (typeof obj === "string") return obj || t("none");
    return isArabic ? obj.valueAr || t("none") : obj.valueEn || t("none");
  };

  // ----- Styles -----
  const classNames = createStaticStyles(({ css }) => ({
    root: css`
      padding: 10px;
    `,
  }));

  const styles = {
    label: { color: "#19355a", fontWeight: "bold" },
    value: { background: "#f3f3f3", color: "#000", padding: "4px 8px" },
  };

  const stylesFn = (info) => {
    if (info.props.size === "default") {
      return {
        root: { borderRadius: 12, border: "1px solid #19355a" },
        label: { color: "#b38e19", fontWeight: "bold" },
      };
    }
    return {};
  };

  // ----- Prepare items -----
  const infoItems = [
    { key: "1", label: t("name"), children: getValue(personalData?.name) },
    {
      key: "2",
      label: t("nationalNumber"),
      children: getValue(personalData?.nationalNumber),
    },
    { key: "3", label: t("title"), children: getValue(personalData?.title) },
    { key: "4", label: t("gender"), children: getValue(personalData?.gender) },
    {
      key: "5",
      label: t("maritalStatus"),
      children: getValue(personalData?.maritalStatus),
    },
    {
      key: "6",
      label: t("university"),
      children: getValue(personalData?.university),
    },
    {
      key: "7",
      label: t("department"),
      children: getValue(personalData?.department),
    },
    {
      key: "8",
      label: t("authority"),
      children: getValue(personalData?.authority),
    },
    { key: "9", label: t("field"), children: getValue(personalData?.field) },
    {
      key: "10",
      label: t("generalSpecialization"),
      children: getValue(personalData?.generalSpecialization),
    },
    {
      key: "11",
      label: t("exactSpecialization"),
      children: getValue(personalData?.accurateSpecialization),
    },
    {
      key: "12",
      label: t("birthDate"),
      children: getValue(personalData?.birthDate),
    },
    {
      key: "13",
      label: t("birthPlace"),
      children: getValue(personalData?.birthPlace),
    },
    {
      key: "14",
      label: t("nameInComposition"),
      children: getValue(personalData?.nameInComposition),
    },
  ];

  return (
    <Layout>
      <div className={`${isArabic ? "rtl" : "ltr"} p-3 flex flex-col`}>
        <h2 className="text-3xl font-bold inline-block relative text-start mb-[40px]">
          {t("personalData")}
          <span className="block w-16 h-1 bg-[#b38e19] mt-1"></span>
        </h2>

        {error && (
          <div className="text-red-500 text-center mb-5 text-lg">{error}</div>
        )}

        <div className="flex flex-wrap justify-center flex-row-reverse gap-10">
          {/* Profile */}
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[280px] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={subPicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => navigate("/editpersonal", { state: personalData })}
              className="bg-[#b38e19] text-white px-4 py-2 rounded-md lg:px-20 lg:py-1 mt-5"
            >
              {t("edit")}
            </button>
          </div>

          {/* Descriptions */}
          <div className="flex-1 min-w-[250px] max-w-[1050px]">
            <Flex vertical gap="middle">
              <Descriptions
                title={t("personalData")}
                items={infoItems}
                bordered
                classNames={classNames}
                styles={stylesFn}
                size="default"
              />
            </Flex>

            {/* ------------------------------------------------------ */}
            {/* Composition Section */}
            {/* ------------------------------------------------------ */}
            <div className="w-full mt-6">
              <div className="max-w-[690px]">
                <h3 className="text-xl font-bold mb-2">
                  {t("compositionTopicTitle")}
                </h3>

                <div
                  className="
                    bg-gray-200 text-black rounded-[12px]
                    border border-[#19355a]
                    w-full h-[120px] p-4
                    overflow-y-auto break-words whitespace-pre-wrap
                  "
                >
                  {personalData?.compositionTopics
                    ? personalData.compositionTopics
                    : t("none")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
