import { FaFacebookF, FaGithub, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 
import { useTranslation } from "react-i18next";

const iconMap = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaXTwitter,
  youtube: FaYoutube,
};

export default function ProfileContent({
  fullName,
  college,
  jobTitle,
  profileImage,
  socials = [],
  isArabic = false,
}) {
  const { t } = useTranslation("dashboard");

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="flex flex-col items-center justify-center text-center w-full h-full p-[clamp(8px,1.2vw,20px)] bg-white/40 backdrop-blur-sm rounded-[1.5rem]"
    >
      {/* Profile Image - Reduced Size */}
      <div className="relative group">
        <div
          className="
            w-[clamp(70px,7vw,140px)]
            h-[clamp(70px,7vw,140px)]
            rounded-full
            border-[clamp(2px,0.3vw,5px)]
            border-[#b38e19]
            overflow-hidden
            mb-[clamp(6px,1vw,14px)]
            shadow-lg
            transition-transform
            duration-500
            group-hover:scale-105
            z-10
          "
        >
          <img
            src={profileImage || "/default-avatar.png"}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Full Name - Smaller Text */}
      <h2 className="text-[#19355A] font-extrabold text-[clamp(15px,1vw,32px)] mb-1 leading-tight">
        {fullName}
      </h2>

      {/* College - Compact Badge */}
      <div className="bg-[#b38e19]/10 px-3 py-0.5 rounded-full mb-2">
        <p className="text-[#b38e19] font-bold text-[clamp(11px,0.8vw,24px)]">
          {college}
        </p>
      </div>

      {/* Job Title - Muted and Smaller */}
      <p className="text-gray-500 font-medium text-[clamp(10px,0.65vw,18px)] max-w-[90%] leading-snug mb-4">
        {jobTitle}
      </p>

      {/* Social Icons - More Compact */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {socials.map((social, index) => {
          const Icon = iconMap[social.type] || FaGithub;
          const isActive = !!social.url;

          return (
            <button
              key={index}
              disabled={!isActive}
              onClick={() => isActive && window.open(social.url, "_blank", "noopener,noreferrer")}
              className={`
                group/icon
                flex items-center justify-center
                w-[clamp(28px,1.8vw,48px)]
                h-[clamp(28px,1.8vw,48px)]
                rounded-lg
                border
                transition-all
                ${isActive 
                  ? "border-gray-100 bg-white shadow-sm hover:border-[#19355A] hover:-translate-y-0.5" 
                  : "border-gray-50 bg-gray-50/50 opacity-40"}
              `}
            >
              <Icon
                className={`
                  ${isActive ? "text-[#19355A]" : "text-gray-300"} 
                  w-[clamp(14px,0.9vw,22px)] h-[clamp(14px,0.9vw,22px)]
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}