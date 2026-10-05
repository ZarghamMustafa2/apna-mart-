import React, { useState, useRef } from 'react';
import { Upload, X, Star, ArrowLeft, ArrowRight, AlertCircle, Plus, Image as ImageIcon } from 'lucide-react';
import { uploadMultipleImages, uploadImage, ImageUploadOptions } from '../../services/mediaService';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  options?: ImageUploadOptions;
  label?: string;
  helperText?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
  options,
  label = 'Product Media Gallery',
  helperText = 'Upload multiple high-resolution photos (JPG, PNG, WebP up to 8MB each). First image is Primary.',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlAdd, setShowUrlAdd] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMsg(null);
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      setErrorMsg(`Maximum ${maxImages} images allowed per product.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = await uploadMultipleImages(fileArray, options);
      onChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload one or more images.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const filtered = images.filter((_, idx) => idx !== index);
    onChange([target, ...filtered]);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    onChange(updated);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlAdd(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
            {label} ({images.length}/{maxImages})
          </label>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{helperText}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlAdd(!showUrlAdd)}
          className="text-[11px] font-bold text-brand-600 dark:text-cyan-400 hover:underline"
        >
          {showUrlAdd ? 'Hide URL Input' : '+ Add via URL'}
        </button>
      </div>

      {showUrlAdd && (
        <form onSubmit={handleAddUrl} className="flex gap-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
          <input
            type="url"
            placeholder="Paste public image link (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl"
          >
            Add Link
          </button>
        </form>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drop Zone Box */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          isDragOver
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
            : 'border-gray-300 dark:border-slate-700 hover:border-brand-500 bg-gray-50/60 dark:bg-slate-900/40 hover:bg-gray-100/50'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-7 h-7 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-brand-600 dark:text-cyan-400">
              Processing & optimizing images...
            </span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center shadow-2xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-slate-200">
                <span className="text-brand-600 dark:text-cyan-400 underline">Select Images</span> or drag multiple files here
              </p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                Support multiple selection from computer, camera, or phone gallery
              </p>
            </div>
          </>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Thumbnails Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((img, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={idx}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-gray-100 dark:bg-slate-900 group shadow-xs ${
                  isPrimary
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />

                {/* Primary Badge */}
                {isPrimary ? (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-brand-600 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-white" /> Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-brand-600 text-white text-[9px] font-extrabold flex items-center gap-1"
                    title="Make this the main image"
                  >
                    Set Primary
                  </button>
                )}

                {/* Top Right Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Navigation Reorder Bar */}
                <div className="absolute bottom-1.5 inset-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-1 bg-black/60 backdrop-blur-xs rounded-lg text-white">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, idx - 1)}
                    className="p-1 hover:text-brand-300 disabled:opacity-30 disabled:hover:text-white"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[9px] font-bold text-gray-300">#{idx + 1}</span>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMove(idx, idx + 1)}
                    className="p-1 hover:text-brand-300 disabled:opacity-30 disabled:hover:text-white"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
