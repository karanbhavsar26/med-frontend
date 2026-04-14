'use client';
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploaderProps {
  onExtract: (file: File) => void;
  isLoading: boolean;
}

export default function FileUploader({ onExtract, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      onExtract(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Upload className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Upload Lab Report</h3>
      <p className="text-gray-500 mb-6">PDF or Image (JPG, PNG, WebP)</p>

      <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
        <FileText className="w-5 h-5" />
        Choose File
        <input
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onExtract(e.target.files[0])}
          disabled={isLoading}
        />
      </label>

      <p className="text-xs text-gray-400 mt-4">or drag & drop here</p>
    </div>
  );
}