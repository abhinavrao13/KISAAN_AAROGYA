import React, { useState } from 'react';
import { ShieldCheck, Leaf, FlaskConical, Shovel, AlertCircle, Info, Calendar } from 'lucide-react';

export default function AdvisoryCard({ advisory, t }) {
  const [activeTab, setActiveTab] = useState('organic'); // 'organic', 'chemical', 'cultural'

  if (!advisory) return null;

  const organic = advisory.organic_treatment || [];
  const chemical = advisory.chemical_treatment || [];
  const cultural = advisory.cultural_practices || [];
  const synergies = advisory.soil_synergies || {};

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 p-5 sm:p-7 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{t.advisory_title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted management practices based on ICAR and global plant pathology standards
          </p>
        </div>

        {advisory.urgency && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
            advisory.urgency === 'Critical'
              ? 'bg-rose-100 text-rose-800 border-rose-200'
              : advisory.urgency === 'High'
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
          }`}>
            Urgency: {advisory.urgency}
          </span>
        )}
      </div>

      {/* Severity Note Banner */}
      {advisory.severity_note && (
        <div className="bg-slate-50 border-l-4 border-emerald-600 p-3.5 rounded-r-xl mb-5 text-xs sm:text-sm text-slate-700 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{advisory.severity_note}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5 space-x-2 sm:space-x-4">
        <button
          onClick={() => setActiveTab('organic')}
          className={`flex items-center space-x-2 pb-3 px-1 sm:px-2 border-b-2 font-bold text-xs sm:text-sm transition ${
            activeTab === 'organic'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>{t.tab_organic}</span>
        </button>

        <button
          onClick={() => setActiveTab('chemical')}
          className={`flex items-center space-x-2 pb-3 px-1 sm:px-2 border-b-2 font-bold text-xs sm:text-sm transition ${
            activeTab === 'chemical'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{t.tab_chemical}</span>
        </button>

        <button
          onClick={() => setActiveTab('cultural')}
          className={`flex items-center space-x-2 pb-3 px-1 sm:px-2 border-b-2 font-bold text-xs sm:text-sm transition ${
            activeTab === 'cultural'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shovel className="w-4 h-4" />
          <span>{t.tab_cultural}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        
        {/* Organic & Bio-Control */}
        {activeTab === 'organic' && (
          <div className="space-y-3">
            {organic.length === 0 ? (
              <p className="text-xs text-slate-500">No specific organic treatments required for healthy crops.</p>
            ) : (
              organic.map((item, idx) => (
                <div key={idx} className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h5 className="font-bold text-sm text-slate-900">{item.title}</h5>
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {item.type || 'Biological'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chemical Treatments */}
        {activeTab === 'chemical' && (
          <div className="space-y-3">
            {chemical.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-4 text-center text-xs sm:text-sm text-slate-600">
                🌱 Healthy foliage detected! Chemical fungicide or pesticide sprays are not recommended.
              </div>
            ) : (
              chemical.map((chem, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h5 className="font-bold text-sm text-slate-900">{chem.title}</h5>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Dose: {chem.dosage}
                      </span>
                      {chem.waiting_period_days && (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Wait: {chem.waiting_period_days} days
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{chem.method}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Cultural & Soil Synergies */}
        {activeTab === 'cultural' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Farm Sanitation & Field Management:</span>
              <ul className="space-y-2">
                {cultural.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Soil Synergies */}
            {Object.keys(synergies).length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Soil Nutrient Connection:</span>
                <div className="space-y-2">
                  {Object.entries(synergies).map(([k, v], idx) => (
                    <div key={idx} className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950">
                      <span className="font-bold capitalize">{k}: </span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
