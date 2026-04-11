import { useRef } from "react";
import { X } from "lucide-react";

export default function AttachmentUploader({
  label,
  note,
  buttonLabel,
  files = [],
  setFiles,
  onRemove,
}) {
  const fileInputRef = useRef(null);

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return extension !== "exe";
    });

    setFiles((prevFiles) => {
      const allFiles = [...prevFiles, ...selectedFiles];
      return allFiles.filter(
        (file, index, self) =>
          index ===
          self.findIndex(
            (f) => (f.fileName || f.name) === (file.fileName || file.name)
          )
      );
    });

    e.target.value = "";
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (file) => {
    if (onRemove) {
      onRemove(file);
    } else {
      setFiles((prev) =>
        prev.filter(
          (f) =>
            (f.id && f.id !== file.id) ||
            (!f.id && f.name !== file.name)
        )
      );
    }
  };

  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2 text-2xl">
        {label}
      </label>

      {note && (
        <p className="text-base text-[#B38E19] mb-2">{note}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="*"
        multiple
        onChange={handleFilesChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-[#19355A] text-white w-[230px] h-[32px] rounded-md border-2 border-[#B38E19]/50 text-base"
      >
        {buttonLabel}
      </button>

      {files.length > 0 && (
        <ol className="mt-4 space-y-3 list-decimal list-outside pl-4 mr-4">
          {files.map((file) => (
            <li
              key={file.id || file.name}
              className="marker:text-[#B38E19] marker:font-bold"
            >
              <div className="flex justify-between items-center">
                <span className="text-[#B38E19] font-semibold">
                  {file.fileName || file.name}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(file)}
                  className="ml-4 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}