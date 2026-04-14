'use client';
import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onExtract: (file: File) => void;
  isLoading: boolean;
  fileName?: string;
}

export default function FileUploader({ onExtract, isLoading, fileName }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = 25 * 1024 * 1024; // 25MB
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      return 'Please upload a PDF or image file (JPG, PNG, WebP)';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 25MB';
    }
    return null;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type !== 'dragleave');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        alert(error);
      } else {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 90) {
            clearInterval(interval);
            progress = 90;
          }
          setUploadProgress(progress);
        }, 200);
        
        onExtract(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        alert(error);
      } else {
        onExtract(file);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Upload Area */}
      <div
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 transition-all duration-300 rounded-2xl overflow-hidden ${
          dragActive
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-slate-600/50 bg-slate-800/30 hover:bg-slate-800/50'
        }`}
      >
        {/* Gradient Border Effect */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          dragActive ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20"></div>
        </div>

        {/* Content */}
        <div className="relative p-12 text-center backdrop-blur-sm">
          {/* Upload Icon */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
            dragActive
              ? 'bg-blue-500/30 scale-110'
              : 'bg-slate-700/50'
          }`}>
            <Upload className={`w-10 h-10 transition-all duration-300 ${
              dragActive 
                ? 'text-blue-300 scale-110' 
                : 'text-slate-400'
            }`} />
          </div>

          {/* Text */}
          <h3 className="text-2xl font-bold text-slate-100 mb-2">
            Upload Lab Report
          </h3>
          <p className="text-slate-400 mb-8">
            Drag and drop your file here or choose from your computer
          </p>

          {/* File Input Button */}
          <label className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            <Upload className="w-5 h-5" />
            <span>Choose File</span>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleChange}
              disabled={isLoading}
            />
          </label>

          {/* Help Text */}
          <p className="text-xs text-slate-500 mt-6">
            Supported: PDF, JPG, PNG, WebP (Max 25MB)
          </p>
        </div>
      </div>

      {/* Recent Files / Tips */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-slate-300">Quick Start</span>
          </div>
          <p className="text-xs text-slate-400">
            Upload any lab report in PDF or image format to begin
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">Pro Tip</span>
          </div>
          <p className="text-xs text-slate-400">
            Higher quality images = more accurate extraction
          </p>
        </div>
      </div>
    </div>
  );
}