// src/App.tsx
import React, { useState, useEffect } from "react";
import {
  Home,
  FolderIcon,
  Star,
  Clock,
  Trash2,
  // HardDrive,
  Share2,
  MoreVertical,
  Grid,
  List,
  Plus,
  Search,
  // ChevronDown,
  CheckCircle,
  Settings,
  HelpCircle,
} from "lucide-react";
import { File, Folder } from "./types";
import ImageViewer from "./components/ImageViewer";
import "./App.css";

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showNewMenu, setShowNewMenu] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [showNewFolderInput, setShowNewFolderInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storageUsed, setStorageUsed] = useState<number>(0);
  const [storageTotal, setStorageTotal] = useState<number>(15); // GB
  const [showPremiumPopup, setShowPremiumPopup] = useState<boolean>(false);
  const [showKhaltiPopup, setShowKhaltiPopup] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState(240); // default 240px (w-60)
  const minSidebarWidth = 250;
  const maxSidebarWidth = 400;

  //mouse handler for resizing
  const handleSidebarResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.min(
        maxSidebarWidth,
        Math.max(minSidebarWidth, startWidth + moveEvent.clientX - startX)
      );
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  // Image Viewer States
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // Generate unique ID helper function
  const generateUniqueId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Load initial data from localStorage
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      const savedFiles = localStorage.getItem("driveFiles");
      const savedFolders = localStorage.getItem("driveFolders");

      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles);

        // Calculate storage used
        const totalBytes = parsedFiles.reduce(
          (acc: number, file: File) => acc + (file.size || 0),
          0
        );
        setStorageUsed(totalBytes / (1024 * 1024 * 1024)); // Convert to GB
      }

      if (savedFolders) {
        setFolders(JSON.parse(savedFolders));
      } else {
        // Initialize with default folders
        const defaultFolders: Folder[] = [
          {
            id: "root",
            name: "My Drive",
            parentId: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "shared",
            name: "Shared with me",
            parentId: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "recent",
            name: "Recent",
            parentId: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "starred",
            name: "Starred",
            parentId: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "trash",
            name: "Trash",
            parentId: null,
            createdAt: new Date().toISOString(),
          },
        ];
        setFolders(defaultFolders);
        localStorage.setItem("driveFolders", JSON.stringify(defaultFolders));
      }

      setIsLoading(false);
    }, 500);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("driveFiles", JSON.stringify(files));
    }
  }, [files, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("driveFolders", JSON.stringify(folders));
    }
  }, [folders, isLoading]);

  // Handle file upload
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const filesArray: File[] = Array.from(fileInput.files).map((file) => ({
        id: generateUniqueId(),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date().toISOString(),
        parentId: currentFolder,
        starred: false,
        url: URL.createObjectURL(file),
        verified: false, // Add the missing 'verified' property
      }));

      setFiles((prevFiles) => [...prevFiles, ...filesArray]);

      // Update storage used
      const newBytes = filesArray.reduce(
        (acc, file) => acc + (file.size || 0),
        0
      );
      setStorageUsed((prev) => prev + newBytes / (1024 * 1024 * 1024));
    }
  };

  // Create a new folder
  const createFolder = (): void => {
    if (!newFolderName.trim()) return;

    const newFolder: Folder = {
      id: generateUniqueId(),
      name: newFolderName.trim(),
      parentId: currentFolder,
      createdAt: new Date().toISOString(),
    };

    setFolders((prevFolders) => [...prevFolders, newFolder]);
    setNewFolderName("");
    setShowNewFolderInput(false);
  };

  // Navigate to a folder
  const navigateToFolder = (folderId: string): void => {
    setCurrentFolder(folderId);
  };

  // Delete a file or folder
  const deleteItem = (id: string, isFolder: boolean): void => {
    if (isFolder) {
      // Recursive function to get all child folder ids
      const getChildFolderIds = (folderId: string): string[] => {
        const childFolders = folders.filter(
          (folder) => folder.parentId === folderId
        );
        return [
          folderId,
          ...childFolders.flatMap((folder) => getChildFolderIds(folder.id)),
        ];
      };

      const folderIdsToDelete = getChildFolderIds(id);

      // Remove all folders and their content
      setFolders(
        folders.filter((folder) => !folderIdsToDelete.includes(folder.id))
      );

      // Calculate storage to be freed
      const filesToDelete = files.filter((file) =>
        folderIdsToDelete.includes(file.parentId)
      );
      const bytesToFree = filesToDelete.reduce(
        (acc, file) => acc + (file.size || 0),
        0
      );
      setStorageUsed((prev) =>
        Math.max(0, prev - bytesToFree / (1024 * 1024 * 1024))
      );

      // Remove files
      setFiles(
        files.filter((file) => !folderIdsToDelete.includes(file.parentId))
      );
    } else {
      const fileToDelete = files.find((file) => file.id === id);
      if (fileToDelete && fileToDelete.size) {
        setStorageUsed((prev) =>
          Math.max(0, prev - fileToDelete.size / (1024 * 1024 * 1024))
        );
      }
      setFiles(files.filter((file) => file.id !== id));
    }
  };

  // Toggle star status for a file
  const toggleStar = (id: string): void => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, starred: !file.starred } : file
      )
    );
  };

  // Get current folder
  const getCurrentFolder = (): Folder | undefined => {
    return folders.find((f) => f.id === currentFolder);
  };

  // Get files and folders in current folder, filtered by search term
  const getCurrentFolderContents = () => {
    const isSpecialFolder = ["shared", "recent", "starred", "trash"].includes(
      currentFolder
    );

    let filteredFiles: File[] = [];
    let filteredFolders: Folder[] = [];

    if (currentFolder === "starred") {
      filteredFiles = files.filter((file) => file.starred);
    } else if (currentFolder === "recent") {
      filteredFiles = [...files]
        .sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        )
        .slice(0, 20);
    } else if (currentFolder === "trash") {
      // In a real app, you'd have a "deleted" flag or a separate array
      filteredFiles = [];
    } else {
      filteredFiles = files.filter((file) => file.parentId === currentFolder);
      filteredFolders = folders.filter(
        (folder) =>
          folder.parentId === currentFolder &&
          !["shared", "recent", "starred", "trash"].includes(folder.id)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredFiles = filteredFiles.filter((file) =>
        file.name.toLowerCase().includes(term)
      );
      filteredFolders = filteredFolders.filter((folder) =>
        folder.name.toLowerCase().includes(term)
      );
    }

    return { files: filteredFiles, folders: filteredFolders };
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date to be more user-friendly
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get icon based on file type
  const getFileIcon = (fileType: string): JSX.Element => {
    if (fileType.startsWith("image/")) {
      return (
        <div className="w-5 h-5 bg-red-500 flex items-center justify-center rounded-sm text-white text-xs">
          IMG
        </div>
      );
    } else if (fileType.includes("pdf")) {
      return (
        <div className="w-5 h-5 bg-red-600 flex items-center justify-center rounded-sm text-white text-xs">
          PDF
        </div>
      );
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return (
        <div className="w-5 h-5 bg-green-600 flex items-center justify-center rounded-sm text-white text-xs">
          XLS
        </div>
      );
    } else if (fileType.includes("document") || fileType.includes("word")) {
      return (
        <div className="w-5 h-5 bg-blue-600 flex items-center justify-center rounded-sm text-white text-xs">
          DOC
        </div>
      );
    } else {
      return (
        <div className="w-5 h-5 bg-gray-500 flex items-center justify-center rounded-sm text-white text-xs">
          FILE
        </div>
      );
    }
  };

  // Get file extension
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  // Handle image click to open the image viewer
  const handleImageClick = (file: File): void => {
    if (file.type.startsWith("image/")) {
      setSelectedImage({ url: file.url, name: file.name });
    } else {
      // For non-images, open in new tab
      window.open(file.url, "_blank");
    }
  };

  const { files: currentFiles, folders: currentFolders } =
    getCurrentFolderContents();
  const currentFolderObject = getCurrentFolder();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-white px-6 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center mr-8">
            <div className="flex items-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center focus:outline-none"
              >
                <img
                  src="src/assets/logo.png"
                  alt="ctrl plus save logo"
                  className="w-12 mr-1"
                />
                <span className="text-2xl font-bold text-black">CTRL+SAVE</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search in Drive"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none flex-1"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Settings size={20} />
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            onClick={() => setShowPremiumPopup(true)}
          >
            Buy Premium
          </button>
        </div>

        {/* Premium Popup */}
        {showPremiumPopup && (
          <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">Buy Premium</h2>
              <p className="text-gray-600 mb-6">Choose your payment method:</p>
              <div className="flex justify-center">
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  onClick={() => setShowKhaltiPopup(true)}
                >
                  Pay with Khalti
                </button>
              </div>
              <button
                className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => setShowPremiumPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Khalti Payment Popup */}
        {showKhaltiPopup && (
          <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">
                Scan QR Code or Pay via Khalti
              </h2>
              <div className="flex justify-center mb-4">
                {/* Random QR Code */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${Math.random()
                    .toString(36)
                    .substring(2)}`}
                  alt="Khalti QR Code"
                  className="w-32 h-32"
                />
              </div>
              <div className="flex justify-center">
                <a
                  href="https://khalti.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Go to Khalti
                </a>
              </div>
              <button
                className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => setShowKhaltiPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/*   */}
        <aside
          className="bg-white border-r border-white p-4 flex flex-col relative"
          style={{ width: sidebarWidth }}
        >
          {/* Resize handle */}
          <div
            className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-20"
            onMouseDown={handleSidebarResize}
          />

          <div className="mb-6">
            <div className="relative">
              <button
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="flex items-center bg-red-300 border border-gray-300 rounded-full px-6 py-3 text-sm font-medium hover:bg-red-400 shadow-sm"
              >
                <Plus size={16} className="mr-2" />
                New
              </button>

              {showNewMenu && (
                <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <ul>
                    <li>
                      <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="w-5 h-5 mr-3 text-blue-600">
                          <FolderIcon size={20} />
                        </div>
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setShowNewFolderInput(true);
                          setShowNewMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <div className="w-5 h-5 mr-3 text-blue-600">
                          <FolderIcon size={20} />
                        </div>
                        <span>New Folder</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => navigateToFolder("root")}
                  className={`flex items-center w-full rounded-lg px-3 py-2 ${
                    currentFolder === "root"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Home size={18} className="mr-3 text-gray-600" />
                  <span>My Drive</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToFolder("shared")}
                  className={`flex items-center w-full rounded-lg px-3 py-2 ${
                    currentFolder === "shared"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Share2 size={18} className="mr-3 text-gray-600" />
                  <span>Shared with me</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToFolder("recent")}
                  className={`flex items-center w-full rounded-lg px-3 py-2 ${
                    currentFolder === "recent"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Clock size={18} className="mr-3 text-gray-600" />
                  <span>Recent</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToFolder("starred")}
                  className={`flex items-center w-full rounded-lg px-3 py-2 ${
                    currentFolder === "starred"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Star size={18} className="mr-3 text-gray-600" />
                  <span>Starred</span>
                </button>
              </li>
              {/* Government Verified Documents */}
              <li>
                <button
                  onClick={() => navigateToFolder("verified")}
                  className={`flex items-center w-full rounded-lg px-3 py-2 ${
                    currentFolder === "verified"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <CheckCircle size={18} className="mr-3 text-green-600" />
                  <span>Government Verified</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToFolder("trash")}
                  className={`flex items-center w-full rounded-lg px-3 py-2 ${
                    currentFolder === "trash"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Trash2 size={18} className="mr-3 text-gray-600" />
                  <span>Trash</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-2">
              {formatFileSize(storageUsed * 1024 * 1024 * 1024)} of{" "}
              {storageTotal} GB used
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (storageUsed / storageTotal) * 100
                  )}%`,
                }}
              ></div>
            </div>
            <button onClick = {() => setShowPremiumPopup(true)} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Get more storage
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto rounded-2xl border border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="p-6">
              {/* View controls */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-medium">
                  {currentFolderObject?.name || "My Drive"}
                </h1>
                <div className="flex items-center">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-l-lg ${
                      viewMode === "list" ? "bg-gray-200" : "bg-gray-100"
                    }`}
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-r-lg ${
                      viewMode === "grid" ? "bg-gray-200" : "bg-gray-100"
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                </div>
              </div>

              {/* New folder input */}
              {showNewFolderInput && (
                <div className="mb-4 flex items-center">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="border border-gray-300 rounded-lg px-3 py-2 mr-2"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === "Enter") createFolder();
                    }}
                  />
                  <button
                    onClick={createFolder}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                    disabled={!newFolderName.trim()}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowNewFolderInput(false);
                      setNewFolderName("");
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* File upload area */}
              {!currentFiles.length && !currentFolders.length && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="mb-4 flex justify-center">
                    <FolderIcon size={48} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    No files or folders here yet
                  </p>
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                    <Plus size={16} className="mr-1" />
                    Upload files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-400 text-sm mt-4">
                    or drag and drop files here
                  </p>
                </div>
              )}

              {/* Files and folders list view */}
              {(currentFiles.length > 0 || currentFolders.length > 0) &&
                viewMode === "list" && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-12 px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-500">
                      <div className="col-span-6">Name</div>
                      <div className="col-span-2">Owner</div>
                      <div className="col-span-2">Last modified</div>
                      <div className="col-span-1">Size</div>
                      <div className="col-span-1"></div>
                    </div>

                    {currentFolders.map((folder) => (
                      <div
                        key={folder.id}
                        className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="col-span-6 flex items-center">
                          <FolderIcon
                            size={18}
                            className="text-gray-500 mr-3"
                          />
                          <span
                            className="cursor-pointer"
                            onClick={() => navigateToFolder(folder.id)}
                          >
                            {folder.name}
                          </span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-500">
                          Me
                        </div>
                        <div className="col-span-2 text-sm text-gray-500">
                          {formatDate(folder.createdAt)}
                        </div>
                        <div className="col-span-1 text-sm text-gray-500">
                          —
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {currentFiles.map((file) => (
                      <div
                        key={file.id}
                        className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="col-span-6 flex items-center">
                          {getFileIcon(file.type)}
                          <span
                            className="ml-3 cursor-pointer hover:underline"
                            onClick={() => handleImageClick(file)}
                          >
                            {file.name}
                          </span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-500">
                          Me
                        </div>
                        <div className="col-span-2 text-sm text-gray-500">
                          {formatDate(file.lastModified)}
                        </div>
                        <div className="col-span-1 text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={() => toggleStar(file.id)}
                            className={`mr-2 ${
                              file.starred
                                ? "text-yellow-400"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <Star size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Files and folders grid view */}
              {(currentFiles.length > 0 || currentFolders.length > 0) &&
                viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentFolders.map((folder) => (
                      <div
                        key={folder.id}
                        className="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md cursor-pointer"
                        onClick={() => navigateToFolder(folder.id)}
                      >
                        <div className="flex justify-center mb-3">
                          <FolderIcon size={36} className="text-gray-500" />
                        </div>
                        <div className="text-center font-medium truncate">
                          {folder.name}
                        </div>
                        <div className="absolute top-2 right-2">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {currentFiles.map((file) => (
                      <div
                        key={file.id}
                        className="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md"
                      >
                        <div className="flex justify-center mb-3">
                          {file.type.startsWith("image/") ? (
                            <div
                              className="h-32 w-32 bg-gray-100 flex items-center justify-center overflow-hidden rounded"
                              onClick={() => handleImageClick(file)}
                            >
                              <img
                                src={file.url}
                                alt={file.name}
                                className="max-h-full max-w-full object-contain cursor-pointer"
                                onError={(e) => {
                                  // If image fails to load, show a placeholder
                                  e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E`;
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              className="h-32 w-32 bg-gray-100 flex items-center justify-center rounded cursor-pointer"
                              onClick={() => handleImageClick(file)}
                            >
                              <div className="text-2xl font-bold text-gray-400">
                                {getFileExtension(file.name)}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-center font-medium truncate mb-1">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {formatFileSize(file.size)}
                        </div>
                        <div className="absolute top-2 right-2 flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(file.id);
                            }}
                            className={`mr-1 ${
                              file.starred
                                ? "text-yellow-400"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <Star size={14} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </main>
      </div>

      {/* Image Viewer */}
      {selectedImage && (
        <ImageViewer
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default App;
