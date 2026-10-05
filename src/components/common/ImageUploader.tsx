import React, { useState, useRef } from 'react';
import { Upload, X, RefreshCw, AlertCircle, Camera, Check } from 'lucide-react';
import { uploadImage, ImageUploadOptions } from '../../services/mediaService';

interface ImageUploaderProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  helperText?: string;
  placeholderText?: string;
  options?: ImageUploadOptions;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  circular?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  helperText = 'JPG, PNG or WebP up to 5MB',
  placeholderText,
  options,
  aspectRatio = 'square',
  className = '',
  circular = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setIsUploading(true);
    try {
      const dataUrl = await uploadImage(file, options);
      onChange(dataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMsg(null);
  };

  const getAspectClass = () => {
    if (circular) return 'w-28 h-28 sm:w-32 sm:h-32 rounded-full';
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video w-full rounded-2xl';
      case 'banner':
        return 'aspect-[21/9] sm:aspect-[3/1] w-full rounded-2xl';
      case 'square':
        return 'aspect-square w-full max-w-[280px] rounded-2xl';
      default:
        return 'min-h-[160px] w-full rounded-2xl';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Drop / Preview Container */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative overflow-hidden cursor-pointer border-2 transition-all flex flex-col items-center justify-center text-center p-3 group ${
          circular ? 'mx-auto' : ''
        } ${getAspectClass()} ${
          isDragOver
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30'
            : value
            ? 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900'
            : 'border-dashed border-gray-300 dark:border-slate-700 hover:border-brand-500 bg-gray-50/80 dark:bg-slate-900/50 hover:bg-gray-100/70'
        }`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded preview"
              className={`w-full h-full object-cover ${circular ? 'rounded-full' : 'rounded-xl'}`}
            />

            {/* Hover overlay with action buttons */}
            <div
              className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 ${
                circular ? 'rounded-full' : 'rounded-xl'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-2 rounded-xl bg-white/90 text-gray-900 hover:bg-white shadow-md text-xs font-bold flex items-center gap-1 transition-transform hover:scale-105"
                title="Change Image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {!circular && <span>Replace</span>}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-600 shadow-md text-xs font-bold transition-transform hover:scale-105"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-3 text-gray-500 dark:text-slate-400">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-brand-600 dark:text-cyan-400">Processing image...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  {circular ? <Camera className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-slate-200">
                    <span className="text-brand-600 dark:text-cyan-400 underline">Choose Image</span> or drag & drop
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{placeholderText || helperText}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
