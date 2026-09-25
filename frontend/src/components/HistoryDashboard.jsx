import React from 'react';
import { History, Calendar, Sprout, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';

export default function HistoryDashboard({ history, onSelectRecord, t }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <History className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-base text-slate-800">No Farm Records Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Scanned crop leaves and diagnoses will automatically be archived here to help you track disease trends over the season.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>{t.nav_history}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Chronological audit log of field scans and epidemiological alerts</p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          {history.length} Scans Archived
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {history.map((rec) => (
          <div key={rec.id} className="py-4 hover:bg-slate-50/80 rounded-2xl px-3 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm text-slate-900">{rec.crop} - {rec.disease}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.severity_level === 'Critical' || rec.severity_level === 'Severe'
                      ? 'bg-rose-100 text-rose-800'
                      : rec.severity_level === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {rec.severity_level} ({rec.affected_area_percent}%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rec.created_at}</span>
                  <span>•</span>
                  <span>Confidence: {rec.confidence}%</span>
                  {rec.temperature_c && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {rec.temperature_c}°C, {rec.humidity_percent}% RH</span>
                    </>
                  )}
                </p>
                {rec.transcript && (
                  <p className="text-xs text-slate-600 mt-1 italic line-clamp-1">"{rec.transcript}"</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                rec.risk_level === 'CRITICAL' || rec.risk_level === 'HIGH'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                Risk: {rec.risk_level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
