import React from 'react';
import { CloudRain, Thermometer, Droplets, Wind, AlertCircle, Clock, ShieldAlert, TrendingUp } from 'lucide-react';

export default function WeatherRiskCard({ weather, riskAssessment, t }) {
  const current = weather?.current || {};
  const forecast = weather?.forecast || [];
  const risk = riskAssessment || {};

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500 text-white border-rose-600';
      case 'HIGH':
        return 'bg-amber-500 text-white border-amber-600';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 p-5 sm:p-7 shadow-sm">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-teal-600" />
          <span>{t.weather_risk_title}</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">Source: {weather?.source || 'Open-Meteo'}</span>
      </div>

      {/* Current Weather Snapshot Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">{t.temperature}</span>
            <p className="text-sm font-bold text-slate-900">{current.temperature_c ?? 27}°C</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">{t.humidity}</span>
            <p className="text-sm font-bold text-slate-900">{current.humidity_percent ?? 75}%</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">{t.rain}</span>
            <p className="text-sm font-bold text-slate-900">{current.precipitation_mm ?? 0} mm</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">{t.wind}</span>
            <p className="text-sm font-bold text-slate-900">{current.wind_speed_kmh ?? 12} km/h</p>
          </div>
        </div>
      </div>

      {/* Disease Spread Risk Banner */}
      <div className={`rounded-2xl p-4 sm:p-5 border mb-5 transition-all ${
        risk.risk_level === 'CRITICAL' || risk.risk_level === 'HIGH'
          ? 'bg-rose-50/70 border-rose-200'
          : 'bg-emerald-50/70 border-emerald-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className={`w-5 h-5 ${risk.risk_level === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`} />
            <h4 className="font-bold text-sm sm:text-base text-slate-900">{risk.alert_headline || 'Spread Risk Analysis'}</h4>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${getRiskBadgeColor(risk.risk_level)}`}>
              {risk.risk_level} RISK ({risk.risk_score || 0}/100)
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
          {risk.alert_message}
        </p>

        {/* Action Spraying Window & Trend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">{t.action_window}:</span>
              <p className="text-slate-600 mt-0.5">{risk.best_spraying_window}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <TrendingUp className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">3-Day Projected Trend:</span>
              <p className="text-slate-600 mt-0.5">{risk.projected_trend || 'Stable'}</p>
            </div>
          </div>
        </div>

        {/* Key Drivers */}
        {risk.key_drivers && risk.key_drivers.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Key Meteorological Drivers:</span>
            <ul className="space-y-1">
              {risk.key_drivers.map((drv, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                  <span>{drv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 5-Day Outlook Chips */}
      {forecast.length > 0 && (
        <div>
          <span className="text-xs font-bold text-slate-600 block mb-2">Upcoming 5-Day Agro-Weather Outlook:</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {forecast.slice(0, 5).map((day, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">{day.date}</span>
                <span className="text-xs font-extrabold text-slate-800 block my-0.5">
                  {Math.round(day.max_temp_c)}° / {Math.round(day.min_temp_c)}°C
                </span>
                <span className="text-[10px] text-blue-600 font-medium block">
                  💧 {day.precip_prob_percent}% rain
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
