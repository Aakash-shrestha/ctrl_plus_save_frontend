// src/components/Header.tsx
import React, { useState } from "react";
import { HeaderProps } from "../types";

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  createFolder,
}) => {
  const [showFolderDialog, setShowFolderDialog] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");

  const handleCreateFolder = (): void => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName("");
      setShowFolderDialog(false);
    }
  };

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-medium text-gray-700">Drive Clone</h1>
      </div>

      <div className="flex-1 mx-6 max-w-3xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search in Drive"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          {viewMode === "grid" ? "List View" : "Grid View"}
        </button>
        <button
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={() => setShowFolderDialog(true)}
        >
          New Folder
        </button>
      </div>

      {showFolderDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-medium mb-4">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                onClick={() => setShowFolderDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={handleCreateFolder}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
