import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout"; // adjust path if needed
import subPicture from "../images/golani.png";
import "../styles/PersonalDataPage.css";

export default function PersonalDataPage() {
  const { t, i18n } = useTranslation("PersonalData");
  const isArabic = i18n.language === "ar";

  return (
    <Layout>
      <div className={`personal-data-page ${isArabic ? "rtl" : "ltr"}`}>
        {/* Page title */}
        <h2 className="page-title">{t("personalData")}</h2>

        <div className="personal-data-container">
          {/* Profile photo */}
          <div className="profile-photo">
            <img src={subPicture} alt="Profile" className="photo" />
          </div>

          {/* Information grid */}
          <div className="personal-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">{t("title")}</span>
                <span className="value">أ.د</span>
              </div>
              <div className="info-item">
                <span className="label">{t("name")}</span>
                <span className="value">صبواي</span>
              </div>
              <div className="info-item">
                <span className="label">{t("university")}</span>
                <span className="value">جامعة حلوان</span>
              </div>
              <div className="info-item">
                <span className="label">{t("nationalId")}</span>
                <span className="value">30XXXXXXXXXXX</span>
              </div>
              <div className="info-item">
                <span className="label">{t("college")}</span>
                <span className="value">كلية الحاسبات والذكاء الاصطناعي</span>
              </div>
              <div className="info-item">
                <span className="label">{t("gender")}</span>
                <span className="value">ذكر</span>
              </div>
              <div className="info-item">
                <span className="label">{t("department")}</span>
                <span className="value">هندسة البرمجيات</span>
              </div>
              <div className="info-item">
                <span className="label">{t("birthPlace")}</span>
                <span className="value">القاهرة، مصر</span>
              </div>
              <div className="info-item">
                <span className="label">{t("generalSpecialization")}</span>
                <span className="value">هندسة البرمجيات</span>
              </div>
              <div className="info-item">
                <span className="label">{t("birthDate")}</span>
                <span className="value">26/11/2026</span>
              </div>
              <div className="info-item">
                <span className="label">{t("field")}</span>
                <span className="value">مجال علوم الحاسبات</span>
              </div>
              <div className="info-item">
                <span className="label">{t("maritalStatus")}</span>
                <span className="value">أعزب</span>
              </div>
              <div className="info-item">
                <span className="label">{t("exactSpecialization")}</span>
                <span className="value">مهندس حوسبة سحابية</span>
              </div>
              <div className="info-item">
                <span className="label">{t("roles")}</span>
                <span className="value">لا يوجد</span>
              </div>
              <div className="info-item">
                <span className="label">{t("positions")}</span>
                <span className="value">لا يوجد</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="buttons">
              <button className={`btn-edit ${isArabic ? "btn-ar" : "btn-en"}`}>
                {t("edit")}
              </button>
              <button className={`btn-back ${isArabic ? "btn-ar" : "btn-en"}`}>
                {t("back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
