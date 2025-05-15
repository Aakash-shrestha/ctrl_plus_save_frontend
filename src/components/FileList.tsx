// src/components/FileList.tsx
import React from "react";
import { FileListProps, File as FileType, Folder } from "../types";

const FileList: React.FC<FileListProps> = ({
  contents,
  viewMode,
  onFolderClick,
  onDelete,
  onToggleStar,
}) => {
  const { files, folders } = contents;

  const getFileIcon = (type: string): string => {
    if (type.includes("image")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("document") || type.includes("word")) return "📝";
    if (type.includes("spreadsheet") || type.includes("excel")) return "📊";
    if (type.includes("presentation") || type.includes("powerpoint"))
      return "📽️";
    if (type.includes("audio")) return "🎵";
    if (type.includes("video")) return "🎬";
    if (type.includes("zip") || type.includes("compressed")) return "🗜️";
    return "📄";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const renderFolderItem = (folder: Folder, index: number) => (
    <div
      key={folder.id}
      className={`group relative ${
        viewMode === "grid"
          ? "bg-white rounded-lg shadow-sm hover:shadow-md p-4 cursor-pointer transition-shadow flex flex-col items-center justify-center"
          : "flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      }`}
      onClick={() => onFolderClick(folder.id)}
    >
      <div
        className={`${viewMode === "grid" ? "text-4xl mb-2" : "text-2xl mr-4"}`}
      >
        📁
      </div>
      <div className={`${viewMode === "grid" ? "text-center" : "flex-1"}`}>
        <div className="font-medium truncate">{folder.name}</div>
        {viewMode === "list" && (
          <div className="text-sm text-gray-500">
            {formatDate(folder.createdAt)}
          </div>
        )}
      </div>
      {viewMode === "list" && (
        <div className="text-sm text-gray-500 mr-4">Folder</div>
      )}
      <div
        className={`absolute right-2 top-2 ${
          viewMode === "grid" ? "opacity-0 group-hover:opacity-100" : ""
        }`}
      >
        <button
          className="p-1 hover:bg-gray-100 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder.id, true);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );

  const renderFileItem = (file: FileType, index: number) => (
    <div
      key={file.id}
      className={`group relative ${
        viewMode === "grid"
          ? "bg-white rounded-lg shadow-sm hover:shadow-md p-4 transition-shadow"
          : "flex items-center p-3 border-b border-gray-100 hover:bg-gray-50"
      }`}
    >
      <div
        className={`${viewMode === "grid" ? "" : "flex items-center w-full"}`}
      >
        <div
          className={`${
            viewMode === "grid" ? "text-4xl mb-2 text-center" : "text-2xl mr-4"
          }`}
        >
          {getFileIcon(file.type)}
        </div>
        <div className={`${viewMode === "grid" ? "" : "flex-1"}`}>
          <div className="font-medium truncate">{file.name}</div>
          {viewMode === "list" && (
            <div className="text-sm text-gray-500">
              {formatDate(file.lastModified)} • {formatFileSize(file.size)}
            </div>
          )}
        </div>
        {viewMode === "list" && (
          <div className="text-sm text-gray-500 mr-4">
            {file.type.split("/")[1] || file.type}
          </div>
        )}
      </div>
      <div
        className={`absolute right-2 top-2 ${
          viewMode === "grid" ? "opacity-0 group-hover:opacity-100" : ""
        }`}
      >
        <button
          className="p-1 hover:bg-gray-100 rounded-full mr-1"
          onClick={() => onToggleStar(file.id)}
        >
          {file.starred ? "⭐" : "☆"}
        </button>
        <button
          className="p-1 hover:bg-gray-100 rounded-full"
          onClick={() => onDelete(file.id, false)}
        >
          🗑️
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      {folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No files or folders found.</p>
        </div>
      ) : (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "space-y-1"
          }`}
        >
          {folders.map(renderFolderItem)}
          {files.map(renderFileItem)}
        </div>
      )}
    </div>
  );
};

export default FileList;
