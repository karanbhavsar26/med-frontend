'use client';
import { useState } from 'react';
import FileUploader from './components/FileUploader';
import ResultViewer from './components/ResultViewer';
import { extractReport } from './lib/api';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleExtract = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setUploadedFile(file);

    try {
      const data = await extractReport(file);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to process report");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12 lg:mb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-300">Medical Report Processing</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Lab Report OCR
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Transform your lab reports into structured FHIR data with AI-powered extraction. 
              Upload PDFs or images and get instant clinical insights.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto">
          {result ? (
            // Results View
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    Processing Complete
                  </h2>
                  <p className="text-slate-400 mt-1">{uploadedFile?.name}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 border border-slate-600 hover:border-slate-500 rounded-lg transition-all duration-200 hover:bg-slate-700/50"
                >
                  Process Another
                </button>
              </div>
              
              <ResultViewer data={result} />
            </div>
          ) : (
            // Upload View
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="lg:col-span-2">
                <FileUploader 
                  onExtract={handleExtract} 
                  isLoading={loading}
                  fileName={uploadedFile?.name}
                />
              </div>

              {/* Info Section */}
              <div className="space-y-4">
                {/* Features */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Features
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'AI-powered text extraction',
                      'FHIR R4 formatting',
                      'Automatic result flagging',
                      'JSON export ready'
                    ].map((feature, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">→</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supported Formats */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Formats
                  </h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex justify-between items-center">
                      <span>PDF Documents</span>
                      <span className="text-blue-400 font-medium">✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>JPG, PNG, WebP</span>
                      <span className="text-blue-400 font-medium">✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Max size: 25MB</span>
                      <span className="text-blue-400 font-medium">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="text-red-400 font-bold text-xl">⚠</div>
                <div>
                  <p className="font-semibold text-red-200">Processing Failed</p>
                  <p className="text-red-300/80 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 max-w-sm w-full mx-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-600 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-100 mb-1">Processing Report</p>
                    <p className="text-sm text-slate-400">
                      {uploadedFile?.name || 'Extracting data...'}
                    </p>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" 
                         style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}