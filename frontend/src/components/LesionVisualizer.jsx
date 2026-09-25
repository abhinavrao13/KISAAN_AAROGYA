import React, { useState } from 'react';
import { Eye, Layers, Percent, AlertTriangle } from 'lucide-react';

export default function LesionVisualizer({ originalUrl, overlayBase64, severity, t }) {
  const [viewMode, setViewMode] = useState('overlay'); // 'overlay', 'original', 'side_by_side'

  const affectedPercent = severity?.affected_area_percent || 0;
  const severityLevel = severity?.severity_level || 'Mild';
  const severityColor = severity?.severity_color || '#f59e0b';

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 p-5 sm:p-7 shadow-sm">
      
      {/* Header & Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>{t.lesion_visualizer_title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            HSV and Excess Green Index (ExG) segmentation isolating necrotic lesions from healthy leaf tissue
          </p>
        </div>

        {/* Switcher tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'overlay' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view_overlay}
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'original' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view_original}
          </button>
          <button
            onClick={() => setViewMode('side_by_side')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'side_by_side' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="mb-5 bg-slate-950/5 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 min-h-[280px]">
        {viewMode === 'side_by_side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-1.5">Original Leaf</span>
              <img
                src={originalUrl}
                alt="Original crop leaf"
                className="max-h-[280px] w-auto object-contain rounded-xl shadow-sm border border-slate-200"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-700 mb-1.5">AI Lesion Map (Red Overlay)</span>
              <img
                src={overlayBase64 || originalUrl}
                alt="Lesion segmentation overlay"
                className="max-h-[280px] w-auto object-contain rounded-xl shadow-sm border border-emerald-300"
              />
            </div>
          </div>
        ) : (
          <div className="relative max-w-full flex items-center justify-center">
            <img
              src={viewMode === 'overlay' && overlayBase64 ? overlayBase64 : originalUrl}
              alt="Leaf visualization"
              className="max-h-[340px] w-auto object-contain rounded-xl shadow-sm"
            />
            {viewMode === 'overlay' && (
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Highlighted Red: Diseased Necrosis</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Severity & Affected Area Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Affected Area */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{t.affected_area}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-slate-900">{affectedPercent}%</span>
              <span className="text-xs text-slate-500">of foliar surface</span>
            </div>
          </div>
        </div>

        {/* Severity Grade */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{t.severity}</span>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold text-slate-900">{severityLevel}</span>
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: severityColor }}
              ></span>
            </div>
          </div>
        </div>

        {/* Foliar Quantification */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Foliar Pixels</span>
            <div className="text-xs text-slate-700 font-mono mt-0.5">
              <span>{severity?.lesion_pixels?.toLocaleString() || 0}</span> / <span>{severity?.total_leaf_pixels?.toLocaleString() || 0}</span> px
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
