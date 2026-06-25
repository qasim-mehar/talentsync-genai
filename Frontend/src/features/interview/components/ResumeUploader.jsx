import { useRef, useState, useCallback } from "react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumeUploader({ file, onFileChange, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateAndSet = useCallback(
    (selectedFile) => {
      setError(null);
      if (!selectedFile) return;
      if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
        setError("Only PDF and DOCX files are accepted.");
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File size must be under 5 MB.");
        return;
      }
      onFileChange(selectedFile);
    },
    [onFileChange]
  );

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };
  const handleInputChange = (e) => validateAndSet(e.target.files?.[0]);
  const handleRemove = () => {
    onFileChange(null); setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold flex items-center gap-2" style={{ color: "#a1a1aa" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        Upload Your Resume
      </label>

      {/* Drop zone */}
      <div
        id="resume-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-200 cursor-pointer"
        style={{
          borderColor: isDragging ? "#52525b" : "#262626",
          backgroundColor: isDragging ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        {/* Upload icon */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "#18181b" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: "#71717a" }}>
            Drag &amp; drop your resume here
          </p>
          <p className="mt-1 text-xs" style={{ color: "#3f3f46" }}>PDF, DOCX — Max 5 MB</p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="mt-1 h-9 px-5 rounded-md text-xs font-semibold text-black bg-white transition-all duration-150 hover:bg-zinc-200 disabled:opacity-50"
        >
          Upload File
        </button>

        <input
          ref={inputRef}
          id="resume-file-input"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs font-medium flex items-center gap-1" style={{ color: "#fca5a5" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </p>
      )}

      {/* Selected file display */}
      {file && !error && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3"
          style={{ border: "1px solid #262626", backgroundColor: "#111111" }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
            style={{ backgroundColor: "#18181b" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#52525b" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "#a1a1aa" }}>{file.name}</p>
            <p className="text-xs" style={{ color: "#3f3f46" }}>{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="text-xs font-medium underline underline-offset-2 transition-colors"
            style={{ color: "#52525b" }}
            onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
            onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
