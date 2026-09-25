import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ShieldCheck, AlertCircle, RefreshCw, CheckCircle2, User } from 'lucide-react';

import Navbar from './components/Navbar';
import VoiceAssistant from './components/VoiceAssistant';
import ImageUploader from './components/ImageUploader';
import LesionVisualizer from './components/LesionVisualizer';
import WeatherRiskCard from './components/WeatherRiskCard';
import AdvisoryCard from './components/AdvisoryCard';
import SoilHealthCard from './components/SoilHealthCard';
import HistoryDashboard from './components/HistoryDashboard';
import NearbyOutbreakMap from './components/NearbyOutbreakMap';
import { TRANSLATIONS } from './i18n/translations';
import { getApiUrl, getStaticUrl } from './config/api';

import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider } from './router/Router';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function MainAppDashboard() {
  const { user } = useAuth();
  const [lang, setLang] = useState('hi'); // Default Hindi for Indian farmers
  const [activeTab, setActiveTab] = useState('diagnose');
  const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090, name: 'Delhi / Central Agri Belt' });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(() => getStaticUrl('/static/samples/tomato_early_blight.jpg'));

  const [soilData, setSoilData] = useState(null);
  const [isSoilLoading, setIsSoilLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null); // null = auto-detect

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Load initial history and soil data
  useEffect(() => {
    fetchHistory();
    // Pre-populate demo diagnosis so the user sees results immediately on launch
    triggerSampleAnalysis({
      filename: 'tomato_early_blight.jpg',
      url: getStaticUrl('/static/samples/tomato_early_blight.jpg')
    });
    // Pre-load default soil data
    loadDefaultSoilReport();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(getApiUrl('/api/history'));
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (e) {
      console.warn("Could not fetch history:", e);
    }
  };

  const loadDefaultSoilReport = async () => {
    try {
      const res = await fetch(getApiUrl('/api/analyze/soil'), { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSoilData(data.soil_report);
      }
    } catch (e) {
      console.warn("Could not load default soil:", e);
    }
  };

  const triggerSampleAnalysis = async (sample) => {
    setIsAnalyzing(true);
    setErrorMsg('');
    const sampleUrl = getStaticUrl(sample.url);
    setSelectedImageUrl(sampleUrl);

    try {
      // Fetch sample blob
      const imgRes = await fetch(sampleUrl);
      const blob = await imgRes.blob();
      const file = new File([blob], sample.filename, { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('language', lang);
      if (selectedCrop) formData.append('crop', selectedCrop);

      const apiRes = await fetch(getApiUrl('/api/analyze/crop'), {
        method: 'POST',
        body: formData
      });

      const data = await apiRes.json();
      if (!data.success) {
        setErrorMsg(data.message || 'Analysis failed. Please try again.');
        setAnalysisResult(null);
      } else {
        setAnalysisResult(data);
        fetchHistory();
        if (data.diagnosis?.disease?.toLowerCase().includes('healthy')) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection to AI engine failed. Ensure backend server is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSelected = async (file) => {
    setIsAnalyzing(true);
    setErrorMsg('');
    setSelectedImageUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('language', lang);
      if (selectedCrop) formData.append('crop', selectedCrop);

      const apiRes = await fetch(getApiUrl('/api/analyze/crop'), {
        method: 'POST',
        body: formData
      });

      const data = await apiRes.json();
      if (!data.success) {
        setErrorMsg(data.message || 'Analysis failed. Please try again.');
        setAnalysisResult(null);
      } else {
        setAnalysisResult(data);
        fetchHistory();
        if (data.diagnosis?.disease?.toLowerCase().includes('healthy')) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze image with backend AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeSoil = async (file) => {
    setIsSoilLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      const res = await fetch(getApiUrl('/api/analyze/soil'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSoilData(data.soil_report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSoilLoading(false);
    }
  };

  const handleUpdateSoilParameters = async (paramObj) => {
    setIsSoilLoading(true);
    try {
      const formData = new FormData();
      formData.append('parameters_json', JSON.stringify(paramObj));
      const res = await fetch(getApiUrl('/api/analyze/soil'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSoilData(data.soil_report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSoilLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col">
      
      {/* Navbar */}
      <Navbar
        currentLang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-sm font-semibold">{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-xs font-bold text-rose-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: CROP HEALTH DIAGNOSIS */}
        {activeTab === 'diagnose' && (
          <div className="space-y-6">
            
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-9 shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.hero_badge}</span>
                </div>
                {user && (
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300/90 mb-1">
                    <span>Active Session:</span>
                    <strong className="text-white">{user.full_name}</strong>
                    <span className="text-emerald-400">•</span>
                    <span className="capitalize">{user.role || 'farmer'}</span>
                    {user.location && <span>({user.location})</span>}
                  </div>
                )}
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
                  {t.hero_title}
                </h1>
                <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
                  {t.hero_desc}
                </p>
              </div>
            </div>

            {/* Voice Assistant Module (Always available) */}
            <VoiceAssistant
              textToSpeak={analysisResult?.voice_summary?.transcript || ""}
              language={lang}
              t={t}
              onQueryReceived={(query) => {
                console.log("Farmer voice query:", query);
              }}
            />

            {/* Image Uploader & Demo Leaf Samples */}
            <ImageUploader
              onImageSelected={handleImageSelected}
              onSampleSelected={triggerSampleAnalysis}
              isAnalyzing={isAnalyzing}
              location={location}
              setLocation={setLocation}
              selectedCrop={selectedCrop}
              setSelectedCrop={setSelectedCrop}
              t={t}
            />

            {/* Analysis Loading Indicator */}
            {isAnalyzing && (
              <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-center shadow-sm">
                <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
                <h4 className="font-extrabold text-base text-slate-800">{t.analyzing}</h4>
                <p className="text-xs text-slate-500 mt-1">Executing MobileNetV3 and HSV contour segmentation algorithms</p>
              </div>
            )}

            {/* DIAGNOSTIC RESULTS DISPLAY */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-6">
                
                {/* Main Diagnosis Summary Card */}
                <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {analysisResult.diagnosis.crop} ({analysisResult.diagnosis[`crop_${lang}`] || analysisResult.diagnosis.crop})
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-500">Scan ID #{analysisResult.scan_id || '901'}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {analysisResult.diagnosis.disease}
                      </h2>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-800 mt-0.5">
                        {analysisResult.diagnosis[`disease_${lang}`] || ''}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t.confidence}</span>
                        <span className="text-xl font-black text-emerald-700">{analysisResult.diagnosis.confidence_percent}%</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t.severity}</span>
                        <span className="text-xl font-black text-slate-900">{analysisResult.severity.severity_level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pathogen description */}
                  <div className="pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p className="mb-1"><strong className="text-slate-800">Pathogen:</strong> {analysisResult.diagnosis.pathogen}</p>
                    <p>{analysisResult.diagnosis[`description_${lang}`] || analysisResult.diagnosis.description}</p>
                  </div>
                </div>

                {/* Lesion Visualizer (Overlay & Quantification) */}
                <LesionVisualizer
                  originalUrl={selectedImageUrl}
                  overlayBase64={analysisResult.severity.overlay_base64}
                  severity={analysisResult.severity}
                  t={t}
                />

                {/* Weather Risk Outlook Card */}
                <WeatherRiskCard
                  weather={analysisResult.weather}
                  riskAssessment={analysisResult.risk_assessment}
                  t={t}
                />

                {/* Agronomic Advisory Card (Organic vs Chemical vs Cultural) */}
                <AdvisoryCard
                  advisory={analysisResult.advisory}
                  t={t}
                />

              </div>
            )}

          </div>
        )}

        {/* TAB 2: OUTBREAK RADAR MAP */}
        {activeTab === 'map' && (
          <NearbyOutbreakMap
            location={location}
            t={t}
          />
        )}

        {/* TAB 3: SOIL HEALTH CARD OCR */}
        {activeTab === 'soil' && (
          <SoilHealthCard
            soilData={soilData}
            onAnalyzeSoil={handleAnalyzeSoil}
            onUpdateParameters={handleUpdateSoilParameters}
            isLoading={isSoilLoading}
            t={t}
          />
        )}

        {/* TAB 3: WEATHER RISK STANDALONE */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            {analysisResult ? (
              <WeatherRiskCard
                weather={analysisResult.weather}
                riskAssessment={analysisResult.risk_assessment}
                t={t}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-center">
                <p className="text-sm text-slate-600">Please diagnose a crop or choose a sample to calculate location-specific pathogen risk.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FARM RECORDS & HISTORY */}
        {activeTab === 'history' && (
          <HistoryDashboard
            history={history}
            t={t}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">KisanArogya AI • Advanced Crop Health & Agricultural Intelligence System</p>
        <p className="text-[11px] text-slate-400 mt-1">Empowering Farmers with Computer Vision, Epidemiological Risk Models, and Multilingual Voice Advisory</p>
      </footer>

    </div>
  );
}

const routes = {
  '/': LandingPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/app': MainAppDashboard
};

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider routes={routes} />
    </AuthProvider>
  );
}

