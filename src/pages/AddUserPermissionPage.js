import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldPlus, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AddUserPermissionPage() {
  const { t } = useTranslation("Users");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 dark:bg-gray-900">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
        <ShieldPlus className="w-10 h-10 text-blue-500 dark:text-blue-400" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Add Individual Permission
        </h1>
        {userId && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            User ID: <span className="font-mono font-medium">{userId}</span>
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          This page is under development. Permission assignment will be
          available here soon.
        </p>
      </div>
    </div>
  );
}
