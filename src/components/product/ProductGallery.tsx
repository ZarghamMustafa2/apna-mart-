import React, { useState } from 'react';
import { Play, ZoomIn } from 'lucide-react';
import { Modal } from '../common/Modal';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  videoUrl?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  videoUrl,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const activeImage = images[selectedImageIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main Image Display Card */}
      <div className="relative aspect-square w-full rounded-3xl bg-gray-50 overflow-hidden border border-gray-100 shadow-sm group">
        <img
          src={activeImage}
          alt={productName}
          className="w-full h-full object-cover object-center cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
          onClick={() => setIsZoomModalOpen(true)}
        />

        {/* Zoom Button Icon Overlay */}
        <button
          onClick={() => setIsZoomModalOpen(true)}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:text-brand-600 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
          title="Zoom image"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Video Thumbnail Button Overlay if available */}
        {videoUrl && (
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="absolute bottom-4 left-4 px-4 py-2 bg-slate-900/90 text-white text-xs font-bold rounded-full backdrop-blur-md flex items-center gap-2 hover:bg-brand-600 transition-all shadow-lg"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Product Video
          </button>
        )}
      </div>

      {/* Thumbnails Navigation Grid */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                selectedImageIndex === idx
                  ? 'border-brand-600 ring-4 ring-brand-500/10 scale-95 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {isZoomModalOpen && (
        <Modal isOpen={isZoomModalOpen} onClose={() => setIsZoomModalOpen(false)} maxWidth="4xl">
          <div className="aspect-square w-full bg-black/90 rounded-2xl flex items-center justify-center p-4">
            <img src={activeImage} alt={productName} className="max-h-full max-w-full object-contain" />
          </div>
        </Modal>
      )}

      {/* Video Modal */}
      {videoUrl && isVideoModalOpen && (
        <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title="Product Demonstration Video">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
            <video controls autoPlay className="w-full h-full">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>
        </Modal>
      )}
    </div>
  );
};
