export default function CoAuthorsList({ coAuthors = [] }) {
  if (!coAuthors.length) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {coAuthors.map((author, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 border rounded-xl shadow-sm"
        >
          {/* الصورة */}
          <img
            src={author.scholarProfileImageURL}
            alt={author.academicName}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.png"; // fallback
            }}
          />

          {/* الاسم + اللينك */}
          <div className="flex flex-col">
            <a
              href={author.scholarProfileLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {author.academicName}
            </a>

            <span className="text-sm text-gray-500">
              {author.jobTitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}