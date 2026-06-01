import React, { useState } from "react";
import { UploadCloud, CheckCircle, XCircle, Loader2 } from "lucide-react";

export function FileUploader({ label, onUpload }) {
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("uploading");
    
    // محاكاة عملية الرفع
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // محاكاة نسبة نجاح 80%
      if (isSuccess) {
        setStatus("success");
        if (onUpload) onUpload(file);
      } else {
        setStatus("error");
      }
    }, 2000);
  };

  return (
    <div className={`p-4 border-2 border-dashed rounded-[12px] transition-all ${
      status === 'success' ? 'border-green-500 bg-green-50' : 
      status === 'error' ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-[#19355a]'
    }`}>
      <label className="flex flex-col items-center cursor-pointer gap-2">
        {status === 'idle' && <UploadCloud className="w-8 h-8 text-slate-400" />}
        {status === 'uploading' && <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />}
        {status === 'success' && <CheckCircle className="w-8 h-8 text-green-500" />}
        {status === 'error' && <XCircle className="w-8 h-8 text-red-500" />}
        
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <input type="file" className="hidden" onChange={handleFile} />
      </label>
    </div>
  );
}