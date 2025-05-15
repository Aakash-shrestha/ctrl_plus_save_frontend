// src/components/ImageViewer.tsx
import React, { useState, useEffect } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageViewerProps {
  imageUrl: string;
  imageName: string;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  imageName,
  onClose,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  // Reset states when a new image is loaded
  useEffect(() => {
    setScale(1);
    setRotation(0);
    setImgLoaded(false);
    setImgError(false);

    // Log the URL to help with debugging
    console.log("Image Viewer URL:", imageUrl);
  }, [imageUrl]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-2 flex items-center justify-between">
        <h3 className="font-medium truncate">{imageName}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Download"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Zoom out"
            disabled={scale <= 0.5}
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Zoom in"
            disabled={scale >= 3}
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Rotate"
          >
            <RotateCw size={20} />
          </button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-900">
        {!imgLoaded && !imgError && (
          <div className="text-white">Loading...</div>
        )}

        {imgError && (
          <div className="text-white text-center">
            <p>Failed to load image</p>
            <p className="text-sm mt-2">
              Check if the file still exists or try reuploading
            </p>
          </div>
        )}

        <div
          className={`relative transition-transform duration-200 ${
            !imgLoaded && !imgError ? "invisible" : ""
          }`}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          <img
            src={imageUrl}
            alt={imageName}
            className="max-h-screen max-w-full object-contain"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              console.error("Failed to load image:", imageUrl);
              setImgError(true);

              // Try to use a placeholder image
              if (imageUrl.startsWith("blob:")) {
                e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Not Available%3C/text%3E%3C/svg%3E`;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
