// src/components/FileUpload.tsx
import React, { useRef } from "react";
import { FileUploadProps } from "../types";

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("ring-2", "ring-blue-500", "border-blue-400");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-blue-500",
      "border-blue-400"
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-blue-500",
      "border-blue-400"
    );

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mb-2"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Files
      </button>
      <p className="text-sm text-gray-500">or drag and drop files here</p>
    </div>
  );
};

export default FileUpload;
