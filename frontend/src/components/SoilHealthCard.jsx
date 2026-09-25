import React, { useState } from 'react';
import { FileSpreadsheet, Upload, RefreshCw, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';

export default function SoilHealthCard({ soilData, onAnalyzeSoil, onUpdateParameters, isLoading, t }) {
  const [params, setParams] = useState(soilData?.parameters || []);
  const [previewImg, setPreviewImg] = useState('/static/samples/sample_soil_card.png');

  const handleInputChange = (index, newVal) => {
    const updated = [...params];
    updated[index].value = parseFloat(newVal) || 0;
    setParams(updated);
  };

  const handleRecalculate = () => {
    const paramObj = {};
    params.forEach(p => {
      paramObj[p.key] = p.value;
    });
    onUpdateParameters(paramObj);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImg(URL.createObjectURL(file));
      onAnalyzeSoil(file);
    }
  };

  const handleDemoClick = () => {
    setPreviewImg('/static/samples/sample_soil_card.png');
    onAnalyzeSoil(null); // Triggers standard demo card OCR parse
  };

  return (
    <div className="space-y-6">
      
      {/* Upload and Hero Header */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Smart Soil Health OCR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t.soil_title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{t.soil_desc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDemoClick}
              disabled={isLoading}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              {t.btn_sample_soil}
            </button>
            <label className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm flex items-center space-x-1.5">
              <Upload className="w-4 h-4" />
              <span>{t.btn_upload_soil}</span>
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Preview image if loaded */}
        {previewImg && (
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col items-center mb-6">
            <span className="text-xs font-bold text-slate-500 mb-2">Processed Soil Card Image:</span>
            <img
              src={previewImg}
              alt="Soil Health Card"
              className="max-h-48 rounded-xl object-contain shadow-sm border border-slate-200"
            />
          </div>
        )}

        {/* Extracted Parameters Table */}
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-900 text-sm">{t.soil_parameters}:</h4>
            <span className="text-xs text-slate-400">Values are editable — update and recalculate below</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Parameter Name</th>
                <th className="py-2.5 px-3">Extracted Value</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Agronomic Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(soilData?.parameters || params).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      step="any"
                      value={item.value}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{item.unit}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'low'
                        ? 'bg-rose-100 text-rose-800'
                        : item.status === 'high'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{item.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleRecalculate}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalculate Fertilizer Plan</span>
            </button>
          </div>
        </div>

      </div>

      {/* Fertilizer & Amendment Advisory Card */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{t.fertilizer_plan}</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Customized nutrient replenishment plan to restore balanced soil chemistry and strengthen disease resistance
        </p>

        {soilData?.deficiencies && soilData.deficiencies.length > 0 && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl">
            <span className="text-xs font-bold text-rose-900 block mb-1">Key Deficiencies to Address:</span>
            <div className="flex flex-wrap gap-2">
              {soilData.deficiencies.map((d, i) => (
                <span key={i} className="text-xs bg-white text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-lg font-semibold">
                  ⚠️ {d}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {(soilData?.recommendations || []).map((rec, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{rec}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
