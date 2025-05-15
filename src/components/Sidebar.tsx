import React from "react";
import { SidebarProps } from "../types";

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  currentFolder,
  navigateToFolder,
  files,
}) => {
  const totalSize = files.reduce((total, file) => total + (file.size || 0), 0);
  const totalSizeGB = totalSize / (1024 * 1024 * 1024);
  const storagePercent = Math.min((totalSizeGB / 15) * 100, 100);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const rootFolders = folders.filter((folder) => folder.parentId === "root");
  const starredFiles = files.filter((file) => file.starred);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4">
        <div
          className={`flex items-center p-2 rounded-lg cursor-pointer ${
            currentFolder === "root"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
          onClick={() => navigateToFolder("root")}
        >
          <span className="mr-3">📁</span>
          <span className="font-medium">My Drive</span>
        </div>

        <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 mt-1">
          <span className="mr-3">⭐</span>
          <span className="font-medium">Starred</span>
          {starredFiles.length > 0 && (
            <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {starredFiles.length}
            </span>
          )}
        </div>

        <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 mt-1">
          <span className="mr-3">🗑️</span>
          <span className="font-medium">Trash</span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Folders
        </h3>
        {rootFolders.map((folder) => (
          <div
            key={folder.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              currentFolder === folder.id
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => navigateToFolder(folder.id)}
          >
            <span className="mr-3">📁</span>
            <span className="truncate">{folder.name}</span>
          </div>
        ))}
      </div>

      {/* New Section: Government Verified Documents */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Government Verified Documents
        </h3>
        {files
          .filter((file) => file.verified) // Assuming `verified` is a boolean property in the `File` type
          .map((file) => (
            <div
              key={file.id}
              className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => navigateToFolder(file.parentId || "root")}
            >
              <span className="mr-3">✅</span>
              <span className="truncate">{file.name}</span>
            </div>
          ))}
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div
            className="bg-blue-600 h-1.5 rounded-full"
            style={{ width: `${storagePercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          {formatSize(totalSize)} of 15 GB used
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
