import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { getAcceptedExtensions, getMaxSizeMB } from "../../lib/fileValidation";
import { VisuallyHidden } from "../ui/VisuallyHidden";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFileSelected,
  accept = ".txt,.pdf",
  disabled = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const descriptionId = "file-dropzone-desc";

  function handleFile(file: File) {
    if (disabled) return;
    onFileSelected(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleClick() {
    if (!disabled) inputRef.current?.click();
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-describedby={descriptionId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <VisuallyHidden>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          tabIndex={-1}
          aria-hidden="true"
        />
      </VisuallyHidden>
      <p id={descriptionId} className="text-gray-500">
        {isDragging
          ? "Solte o arquivo aqui"
          : `Arraste ou clique para anexar (${getAcceptedExtensions()}, até ${getMaxSizeMB()}MB)`}
      </p>
    </div>
  );
}
