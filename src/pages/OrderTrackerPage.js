import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CheckCircle,
  Clock3,
  XCircle,
  User,
  Calendar,
  FileText,
} from "lucide-react";

import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

export default function ApplicationTracker() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tracker");

  const isRTL = i18n.language === "ar";

  // Dummy Data
  const application = {
    id: 125,
    applicantName: "Ahmed Mohamed",
    title: "IEEE Conference 2026",
    submittedAt: "2026-06-03",
    status: "Rejected", // Submitted | UnderReview | Approved | Rejected
    comment: "احا فين باقي المستندات",
  };

  const baseSteps =
    application.status === "Rejected"
      ? ["Submitted", "UnderReview", "Rejected"]
      : ["Submitted", "UnderReview", "Approved"];

  const steps = isRTL ? [...baseSteps].reverse() : baseSteps;

  const currentStep = baseSteps.indexOf(application.status);

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "#64748b";

      case "UnderReview":
        return "#3b82f6";

      case "Approved":
        return "#22c55e";

      case "Rejected":
        return "#ef4444";

      default:
        return "#64748b";
    }
  };

  const progressColor = getStatusColor(application.status);

  const progress =
    currentStep <= 0 ? 0 : (currentStep / (steps.length - 1)) * 100;

  const stepLabel = {
    Submitted: t("tracker.submitted"),
    UnderReview: t("tracker.underReview"),
    Approved: t("tracker.approved"),
    Rejected: t("tracker.rejected"),
  };

  return (
    <ResponsiveLayoutProvider>
      <div dir={isRTL ? "rtl" : "ltr"} className="p-2 ">
        <div className="w-full flex ">
          <button
            onClick={() => navigate(-1)}
            className="
      group shiny-btn relative overflow-hidden
      ms-auto flex items-center gap-2
      bg-gradient-to-r from-[#b38e19] to-[#d4af37]
      text-white px-6 py-2.5
      rounded-xl text-xs sm:text-sm font-bold
      shadow-[0_4px_15px_rgba(179,142,25,0.35)]
      hover:shadow-[0_6px_20px_rgba(25,53,90,0.4)]
      hover:from-[#19355A] hover:to-[#254d80]
      transition-all duration-500
      hover:-translate-y-0.5 active:translate-y-0
      shrink-0
    "
          >
            {/* 🔥 Shimmer layer */}
            <span className="absolute inset-0 -translate-x-full bg-white/20 skew-x-12 group-hover:translate-x-full transition-transform duration-700"></span>

            {/* Arrow */}
            {isRTL ? (
              <span className="relative z-10 text-base sm:text-xl font-extrabold transition-transform duration-300 group-hover:-translate-x-1.5">
                ←
              </span>
            ) : (
              <span className="relative z-10 text-base sm:text-xl font-extrabold transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            )}

            {/* Text */}
            <span className="relative z-10 select-none">
              {isRTL ? "عودة" : "Back"}
            </span>
          </button>
        </div>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
            <div
              className="h-2"
              style={{
                background: "linear-gradient(90deg,#19355A,#B38E19)",
              }}
            />

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "#19355A" }}
                  >
                    {t("tracker.title")}
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    #{application.id}
                  </p>
                </div>

                <StatusBadge status={application.status} t={t} />
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="mt-5 rounded-3xl bg-white p-6 shadow-lg">
            {/* Tracker */}
            <h2
              className="mb-10 text-lg font-semibold"
              style={{ color: "#19355A" }}
            >
              {t("tracker.currentStatus")}
            </h2>

            <div className="relative mb-12">
              {/* Background Line */}
              <div
                className="absolute left-0 right-0 h-1 rounded-full bg-slate-200"
                style={{
                  top: "28px",
                  transform: "translateY(-50%)",
                }}
              />

              {/* Progress Line */}
              <div
                className="absolute h-2 rounded-full transition-all duration-1000"
                style={{
                  top: "28px",
                  transform: "translateY(-50%)",
                  width: `${progress}%`,
                  background: progressColor,
                  ...(isRTL ? { right: 0 } : { left: 0 }),
                }}
              />

              {/* Steps */}
              <div
                className={`relative flex justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {steps.map((step, index) => {
                  const realIndex = isRTL ? baseSteps.indexOf(step) : index;

                  const currentIndex = currentStep;
                  const completed = realIndex < currentIndex;
                  const active = realIndex === currentIndex;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`
    flex h-14 w-14 items-center
    justify-center rounded-full
    border-4 bg-white
    transition-all duration-500
    ${active ? "animate-statusPulse" : ""}
  `}
                        style={{
                          borderColor:
                            completed || active ? progressColor : "#d1d5db",

                          background:
                            completed || active ? progressColor : "#fff",

                          color: completed || active ? "#fff" : "#9ca3af",
                        }}
                      >
                        {step === "Rejected" ? (
                          <XCircle size={20} />
                        ) : completed ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Clock3 size={20} />
                        )}
                      </div>

                      <span className="mt-3 text-center text-xs font-medium">
                        {stepLabel[step]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<User size={18} />}
                title={t("tracker.applicant")}
                value={application.applicantName}
              />

              <InfoCard
                icon={<FileText size={18} />}
                title={t("tracker.conference")}
                value={application.title}
              />

              <InfoCard
                icon={<Calendar size={18} />}
                title={t("tracker.submissionDate")}
                value={application.submittedAt}
              />
            </div>

            {/* Status */}
            <div
              className="mt-6 rounded-2xl p-5"
              style={{
                background: `${progressColor}15`,
              }}
            >
              <h3
                className="font-semibold"
                style={{
                  color: progressColor,
                }}
              >
                {stepLabel[application.status]}
              </h3>
            </div>

            {/* Rejection Comment */}
            {application.comment?.trim() && (
              <div className="mt-6 rounded-2xl border-l-4 border-red-500 bg-red-50 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <XCircle size={20} className="text-red-600" />

                  <h3 className="font-semibold text-red-700">
                    {t("tracker.comment")}
                  </h3>
                </div>

                <p className="mt-3 text-sm text-gray-700">
                  {application.comment}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div
      className="
    rounded-2xl
    bg-white
    p-4
    shadow-md
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-lg
  "
      style={{
        border: "1px solid #B38E1925",
      }}
    >
      <div className="mb-2" style={{ color: "#B38E19" }}>
        {icon}
      </div>

      <p className="text-xs text-gray-500">{title}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status, t }) {
  const labels = {
    Submitted: t("tracker.submitted"),
    UnderReview: t("tracker.underReview"),
    Approved: t("tracker.approved"),
    Rejected: t("tracker.rejected"),
  };

  const styles = {
    Submitted: {
      bg: "#e2e8f0",
      color: "#475569",
    },
    UnderReview: {
      bg: "#dbeafe",
      color: "#2563eb",
    },
    Approved: {
      bg: "#dcfce7",
      color: "#16a34a",
    },
    Rejected: {
      bg: "#fee2e2",
      color: "#dc2626",
    },
  };

  return (
    <span
      className="rounded-full px-4 py-2 text-sm font-semibold"
      style={{
        background: styles[status]?.bg,
        color: styles[status]?.color,
      }}
    >
      {labels[status]}
    </span>
  );
}
