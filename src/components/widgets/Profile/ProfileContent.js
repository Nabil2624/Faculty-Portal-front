import { FaFacebookF, FaGithub, FaLinkedinIn, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";


const iconMap = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaTwitter, // هنا اختار أيقونة مناسبة لـ X (Twitter سابقًا)
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
      className="flex flex-col items-center justify-center text-center w-full h-full p-[clamp(10px,1.2vw,24px)]"
    >
      {/* Profile Image */}
      <div
        className="
          w-[clamp(80px,8vw,180px)]
          h-[clamp(80px,8vw,180px)]
          rounded-full
          border-[clamp(1.5px,0.3vw,7px)]
          border-[#b38e19]
          overflow-hidden
          mb-[clamp(8px,1vw,18px)]
        "
      >
        <img
          src={profileImage}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Full Name */}
      <h2 className="text-[#19355A] font-bold text-[clamp(14px,1.1vw,40px)] mb-[clamp(4px,0.2vw,17px)]">
        {fullName}
      </h2>

      {/* College */}
      <p className="text-[#b38e19] font-semibold text-[clamp(12px,1vw,35px)] mb-[clamp(3px,0.1vw,15px)]">
        {college}
      </p>

      {/* Job Title */}
      <p className="text-gray-700 text-[clamp(11px,0.8vw,25px)] mb-[clamp(10px,1vw,25px)]">
        {jobTitle}
      </p>

      {/* Social Icons */}
      <div
        className={`flex gap-[clamp(8px,1vw,18px)] mt-[clamp(6px,0.8vw,25px)] ${
          isArabic ? "justify-end" : "justify-start"
        }`}
      >
        {socials.map((social, index) => {
          const Icon = iconMap[social.type];
          const isActive = !!social.url;

          return (
            <div
              key={index}
              onClick={() =>
                isActive &&
                window.open(social.url, "_blank", "noopener,noreferrer")
              }
              className={`
                flex items-center justify-center
                w-[clamp(32px,2vw,60px)]
                h-[clamp(32px,2vw,60px)]
                rounded-[clamp(5px,0.2vw,15px)]
                border-[clamp(1.5px,0.25vw,5px)]
                transition
                ${isActive ? "border-[#19355A] cursor-pointer hover:scale-110" : "border-gray-300 cursor-not-allowed"}
              `}
            >
              <Icon
                className={`${
                  isActive ? "text-[#19355A]" : "text-gray-300"
                } w-[clamp(14px,1.1vw,35px)] h-[clamp(14px,1.1vw,35px)]`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
