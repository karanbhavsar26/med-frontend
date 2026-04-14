'use client';
import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Download, Copy, ChevronDown } from 'lucide-react';

interface ResultViewerProps {
  data: any;
}

export default function ResultViewer({ data }: ResultViewerProps) {
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const observations = data.entry || [];
  const needsReview = data.meta?.needsReview || [];

  // Group by Panel
  const grouped = observations.reduce((acc: any, entry: any) => {
    const display = entry.resource.code.text || '';
    const panelName = display.split(' - ')[0] || 'General';
    
    if (!acc[panelName]) acc[panelName] = [];
    acc[panelName].push(entry.resource);
    return acc;
  }, {});

  const panelNames = Object.keys(grouped);

  const copyToClipboard = (text: string, index: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-report-fhir.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Extracted Observations</h2>
              <p className="text-sm text-slate-400 mt-1">
                <span className="text-blue-300 font-semibold">{observations.length}</span> tests extracted • FHIR R4
              </p>
            </div>
          </div>

          <button
            onClick={downloadJSON}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </div>

      {/* Panels */}
      <div className="space-y-4">
        {panelNames.map((panelName) => {
          const obsList = grouped[panelName];
          const isExpanded = expandedPanel === panelName;

          return (
            <div key={panelName} className="bg-slate-900/70 border border-slate-700 rounded-2xl overflow-hidden">
              {/* Panel Header */}
              <button
                onClick={() => setExpandedPanel(isExpanded ? null : panelName)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-100">{panelName}</h3>
                    <p className="text-xs text-slate-500">{obsList.length} observations</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Table */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="overflow-x-auto rounded-xl border border-slate-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-800 border-b border-slate-700">
                          <th className="text-left py-4 px-5 font-medium text-slate-300">Test Name</th>
                          <th className="text-right py-4 px-5 font-medium text-slate-300">Value</th>
                          <th className="text-left py-4 px-5 font-medium text-slate-300">Unit</th>
                          <th className="text-left py-4 px-5 font-medium text-slate-300">Reference Range</th>
                          <th className="text-center py-4 px-5 font-medium text-slate-300">Status</th>
                          <th className="text-center py-4 px-5 font-medium text-slate-300">LOINC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {obsList.map((obs: any, idx: number) => {
                          const interp = obs.interpretation?.[0]?.coding?.[0];
                          const isHigh = interp?.code === 'H';
                          const isLow = interp?.code === 'L';

                          // Build reference range string
                          let refRange = '';
                          const range = obs.referenceRange?.[0];
                          if (range) {
                            if (range.low && range.high) {
                              refRange = `${range.low.value} - ${range.high.value}`;
                            } else if (range.high) {
                              refRange = `< ${range.high.value}`;
                            } else if (range.low) {
                              refRange = `> ${range.low.value}`;
                            }
                          }

                          return (
                            <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                              <td className="py-4 px-5 text-slate-100 font-medium">
                                {obs.code.text}
                              </td>
                              <td className="py-4 px-5 text-right font-mono text-slate-200">
                                {obs.valueQuantity.value}
                              </td>
                              <td className="py-4 px-5 text-slate-400">
                                {obs.valueQuantity.unit}
                              </td>
                              <td className="py-4 px-5 text-slate-300 font-mono text-sm">
                                {refRange || '-'}
                              </td>
                              <td className="py-4 px-5 text-center">
                                <span className={`px-4 py-1 rounded-full text-xs font-semibold ${
                                  isHigh ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                  isLow ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  {isHigh ? 'HIGH' : isLow ? 'LOW' : 'NORMAL'}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-center font-mono text-xs text-slate-400">
                                {obs.code.coding[0].code}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}