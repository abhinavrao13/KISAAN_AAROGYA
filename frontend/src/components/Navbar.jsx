import React from 'react';
import { Sprout, Globe2, Activity, MapPin, FileSpreadsheet, CloudSun, History, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
];

export default function Navbar({ currentLang, setLang, activeTab, setActiveTab, t }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('diagnose')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Kisan<span className="text-emerald-600">Arogya</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">AI 2.0</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">{t.app_subtitle}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('diagnose')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'diagnose'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t.nav_diagnose}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'map'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{t.nav_map || 'Outbreak Map'}</span>
            </button>

            <button
              onClick={() => setActiveTab('soil')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'soil'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t.nav_soil}</span>
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'weather'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CloudSun className="w-4 h-4" />
              <span>{t.nav_weather}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'history'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t.nav_history}</span>
            </button>
          </nav>

          {/* Right Controls: Language Selector, User Profile, & Logout */}
          <div className="flex items-center space-x-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs hover:border-emerald-300 transition">
              <Globe2 className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            {/* User Profile Badge (if logged in) */}
            {user && (
              <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs uppercase">
                  {user.full_name ? user.full_name.charAt(0) : 'F'}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 leading-tight max-w-[110px] truncate">
                    {user.full_name || 'Farmer'}
                  </span>
                  <span className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-wider capitalize">
                    {user.role || 'farmer'}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Logout from account"
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition active:scale-95 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex border-t border-slate-200 bg-white overflow-x-auto py-2 px-3 space-x-2">
        <button
          onClick={() => setActiveTab('diagnose')}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap ${
            activeTab === 'diagnose' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.nav_diagnose}
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap ${
            activeTab === 'map' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.nav_map || 'Outbreak Map'}
        </button>
        <button
          onClick={() => setActiveTab('soil')}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap ${
            activeTab === 'soil' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.nav_soil}
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap ${
            activeTab === 'weather' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.nav_weather}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap ${
            activeTab === 'history' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.nav_history}
        </button>
      </div>
    </header>
  );
}
