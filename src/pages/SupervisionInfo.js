import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useBreakpoint from "../hooks/useBreakpoint";
import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

import ResearchTitle from "../components/ui/ResearchTitle";
import LoadingSpinner from "../components/LoadingSpinner";
import SupervisionInfoMobile from "../components/widgets/SupervisionInfo/SupervisionInfoMobile";
import SupervisionInfoTablet from "../components/widgets/SupervisionInfo/SupervisionInfoTablet";
import SupervisionInfoDesktop from "../components/widgets/SupervisionInfo/SupervisionInfoDesktop";
import PageHeaderLongAction from "../components/ui/PageHeaderLongAction";
import { useLocation, useNavigate } from "react-router-dom";
import { getAcademicGrades } from "../services/lookup.service";

export default function SupervisionInfo() {
  const { t, i18n } = useTranslation("SupervisionInfo");
  const isArabic = i18n.language === "ar";
  const bp = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [grades, setGrades] = useState([]);
  const { state } = useLocation();
  const thesesId = state?.id;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!location.state) {
        navigate("/supervision-thesis");
        return;
      }

      setInfo(location.state);

      try {
        const res = await getAcademicGrades();
        setGrades(res.data || []);
      } catch (err) {
        console.error("Failed to fetch grades");
      }
    };

    loadData();
  }, [location.state, navigate]);

  if (!info) return null;

  if (loading) return <LoadingSpinner />;

  if (!info) return null;

  const gradeObject = grades.find((g) => g.id === info.gradeId);

  const resolvedDegree = info.grade
    ? isArabic
      ? info.grade.valueAr
      : info.grade.valueEn
    : "-";

  const translatedThesisType = info.type === "PHD" ? t("PHD") : t("MASTERS");

  const translatedRole = (() => {
    switch (info.facultyMemberRole) {
      case "Adminstrator":
        return t("Adminstrator");
      case "Reviewer":
        return t("Reviewer");
      case "AdminstratorAndReviewer":
      case "ReviewerAndAdminstrator":
        return t("AdminstratorAndReviewer");
      default:
        return info.facultyMemberRole;
    }
  })();

  const displayInfo = {
    thesisType: translatedThesisType,
    role: translatedRole,
    studentName: info.studentName,
    specialization: info.specialization,
    degree: resolvedDegree,
    registrationDate: info.registrationDate,
    formationDate: info.supervisionFormationDate,
    discussionDate: info.discussionDate,
    grantDate: info.grantingDate,
    university: info.universityOrFaculty,
  };

  return (
    <ResponsiveLayoutProvider>
      <div className={`${isArabic ? "rtl" : "ltr"} p-6`}>
        <PageHeaderLongAction
          title={t("title")}
          actionLabel={t("edit")}
          onAction={() => {
            navigate("/edit-supervision", {
              state: {
                ...info, // now includes all correct names
                facultyMemberRole: (() => {
                  switch (info.facultyMemberRole) {
                    case "Adminstrator":
                      return 1;
                    case "Reviewer":
                      return 2;
                    case "AdminstratorAndReviewer":
                    case "ReviewerAndAdminstrator":
                      return 3;
                    default:
                      return 1;
                  }
                })(),
                grade: info.grade || null, // full object for select prefill
              },
            });
          }}
        />

        <ResearchTitle title={info.title} />

        {bp === "mobile" && <SupervisionInfoMobile info={displayInfo} t={t} />}
        {bp === "tablet" && <SupervisionInfoTablet info={displayInfo} t={t} />}
        {bp === "desktop" && (
          <SupervisionInfoDesktop info={displayInfo} t={t} />
        )}
      </div>
    </ResponsiveLayoutProvider>
  );
}
