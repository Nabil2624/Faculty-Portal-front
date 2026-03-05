import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function AttachmentUploader({
  label,
  note,
  buttonLabel,
  files = [],
  setFiles,
}) {
  const fileInputRef = useRef(null);


  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();

      // Block exe files
      if (extension === "exe") {
        // alert("Executable (.exe) files are not allowed.");
        return false;
      }

      return true;
    });

    setFiles((prevFiles) => {
      const allFiles = [...prevFiles, ...selectedFiles];
      const uniqueFiles = allFiles.filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name),
      );

      // SEND FILES TO PARENT
      // if (onChange) onChange(uniqueFiles);

      return uniqueFiles;
    });

    e.target.value = "";
  };

  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (name) => {
    setFiles((prevFiles) => {
      const updated = prevFiles.filter(
        (file) => (file.fileName || file.name) !== name,
      );

      // if (onChange) onChange(updated);
      return updated;
    });
  };
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2 text-2xl">
        {label}
      </label>
      {note && <p className="text-base text-[#B38E19] mb-2">{note}</p>}

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*"
        multiple
        onChange={handleFilesChange}
        className="hidden"
      />

      {/* Attachments button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-[#19355A] text-white w-[230px] h-[32px] rounded-md border-2 border-[#B38E19]/50 text-base"
      >
        {buttonLabel}
      </button>

      {/* Display selected PDF files */}
      {files.length > 0 && (
        <ol className="mt-4 space-y-3 list-decimal list-outside pl-4 mr-4">
          {files.map((file, index) => (
            <li
              key={file.name}
              className="marker:text-[#B38E19] marker:font-bold"
            >
              <div className="flex justify-between items-center">
                <span className="text-[#B38E19] font-semibold">
                  {file.fileName || file.name}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="
    ml-40
    p-1.5 
    rounded-full 
    text-gray-400 
    hover:text-red-500 
    hover:bg-gray-100 
    transition 
    duration-200
  "
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
