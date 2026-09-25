import React, { useState } from 'react';
import {
  Sprout,
  ShieldCheck,
  Zap,
  Cpu,
  Eye,
  CloudSun,
  FileSpreadsheet,
  Volume2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { Link, useNavigate } from '../router/Router';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/register');
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">

      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    Kisan<span className="text-emerald-600">Arogya</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    AI AgriTech
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Intelligent Plant Disease Detection Platform</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition">About</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition">How It Works</button>
              <button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 transition">Features</button>
              <button onClick={() => scrollToSection('technology')} className="hover:text-emerald-600 transition">Technology</button>
              <button onClick={() => scrollToSection('impact')} className="hover:text-emerald-600 transition">Impact</button>
            </nav>

            {/* Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/app')}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <Activity className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-700 hover:text-emerald-600 px-4 py-2 rounded-xl transition hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleStartClick}
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 font-semibold text-slate-700">About</button>
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-2 font-semibold text-slate-700">How It Works</button>
            <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 font-semibold text-slate-700">Features</button>
            <button onClick={() => scrollToSection('technology')} className="block w-full text-left py-2 font-semibold text-slate-700">Technology</button>
            <button onClick={() => scrollToSection('impact')} className="block w-full text-left py-2 font-semibold text-slate-700">Impact</button>
            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/app')}
                  className="w-full text-center bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center py-2.5 font-bold text-slate-700 bg-slate-100 rounded-xl">
                    Login
                  </Link>
                  <button
                    onClick={handleStartClick}
                    className="w-full text-center bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>


      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft background decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/50 via-teal-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              <div className="inline-flex items-center space-x-2 bg-emerald-100/80 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI-Driven Foliar Pathology & Spread Forecasting</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Protect Your Crops with <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Artificial Intelligence</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Detect foliar diseases in real-time from leaf photographs. Our hybrid MobileNetV3 computer vision pipeline segments lesion areas, forecasts weather-driven spread risk, and delivers tailored agronomic treatment advisory in 6 regional languages.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleStartClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition active:scale-95 group"
                >
                  <span>Start Free Diagnosis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base px-8 py-4 rounded-2xl shadow-sm transition"
                >
                  <span>Farmer Login</span>
                </Link>
              </div>

              {/* Trust & Spec Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 text-left">
                <div className="bg-white/80 border border-slate-200 rounded-xl p-3 shadow-xs">
                  <span className="block text-xl font-black text-emerald-600">38</span>
                  <span className="text-xs font-semibold text-slate-500">Disease Classes</span>
                </div>
                <div className="bg-white/80 border border-slate-200 rounded-xl p-3 shadow-xs">
                  <span className="block text-xl font-black text-teal-600">14</span>
                  <span className="text-xs font-semibold text-slate-500">Major Crops</span>
                </div>
                <div className="bg-white/80 border border-slate-200 rounded-xl p-3 shadow-xs">
                  <span className="block text-xl font-black text-slate-800">&lt; 0.5s</span>
                  <span className="text-xs font-semibold text-slate-500">Inference Time</span>
                </div>
                <div className="bg-white/80 border border-slate-200 rounded-xl p-3 shadow-xs">
                  <span className="block text-xl font-black text-emerald-600">6</span>
                  <span className="text-xs font-semibold text-slate-500">Indian Languages</span>
                </div>
              </div>

            </div>

            {/* Right Visual: Interactive Simulated Diagnostic Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 sm:p-7 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Live AI Diagnosis</span>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                    Tomato Crop
                  </span>
                </div>

                {/* Simulated Leaf Image with Lesion Contours */}
                <div className="mt-4 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-video flex items-center justify-center group">
                  <img
                    src="/static/samples/tomato_early_blight.jpg"
                    alt="Tomato Early Blight Diagnosis"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                  />
                  {/* Overlay Badge */}
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 flex items-center space-x-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HSV Chlorosis Mask Active</span>
                  </div>
                </div>

                {/* Diagnosis Details */}
                <div className="mt-5 space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Tomato Early Blight</h3>
                      <p className="text-xs font-medium text-slate-500">Pathogen: Alternaria solani (Fungal)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-600">94.5%</span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                    </div>
                  </div>

                  {/* Severity Bar */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Lesion Severity</span>
                      <span className="text-amber-600">Moderate (18.2% Leaf Area)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>

                  {/* Microclimate Risk & Voice pill */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 p-2.5 rounded-xl font-semibold flex items-center space-x-2">
                      <CloudSun className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Spread Risk: High</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 rounded-xl font-semibold flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Hindi / Regional Audio</span>
                    </div>
                  </div>

                  {/* Try Action */}
                  <button
                    onClick={handleStartClick}
                    className="w-full mt-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>Test on Your Own Leaf Image</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. ABOUT / PROBLEM & SOLUTION */}
      <section id="about" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Agricultural Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Early Detection Saves Harvests Before Spores Spread
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Every crop season, farmers face devastating yield losses from foliar pathogens like Late Blight, Common Rust, and Bacterial Spot. Visual symptoms in the early stages are subtle and often confused, leading to misapplied chemical treatments or total crop destruction.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">20% – 40% Global Yield Loss</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Untreated fungal, bacterial, and viral foliar diseases drastically reduce agricultural productivity and farmer household incomes across rural communities.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Overuse of Toxic Chemicals</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Without precise pathogen identification, farmers frequently spray indiscriminate synthetic pesticides, damaging soil ecology and increasing operational expenses.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">The KisanArogya AI Solution</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                By combining Deep Learning with OpenCV computer vision and microclimate forecasts, any smartphone becomes an instant, scientifically backed foliar laboratory.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* 4. HOW IT WORKS (4-STEP VISUAL PIPELINE) */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From Leaf Photograph to Treatment in Seconds
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A streamlined, scientifically grounded four-step process engineered for ease of use in the field.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                    1
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 01</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Upload Leaf Photo</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Capture or upload a clear photo of an affected leaf. Choose your crop for conditioned accuracy or let the AI auto-detect.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Automatic Foliage Validation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xl">
                    2
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 02</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Foliar CV Segmentation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  OpenCV algorithms compute Excess Green Index (ExG), HSV chlorosis halos, necrotic boundaries, and pustule morphology.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-teal-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quantifies % Leaf Affected</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl">
                    3
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 03</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Disease Classification</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  MobileNetV3 neural inference identifies the specific pathogen (fungal, bacterial, viral, or pest damage) with confidence rating.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-indigo-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>38 Specific Pathogen Classes</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl">
                    4
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 04</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Actionable Advisory</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive weather-adjusted disease spread risk, organic and chemical treatment advice, and native voice audio summary.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold text-amber-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Multilingual Speech Output</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 5. FEATURES SHOWCASE */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineered Specifically for Crop Pathology
            </h2>
            <p className="text-base text-slate-600">
              Every tool in KisanArogya AI is backed by real agronomic logic, Computer Vision masks, and local meteorological forecasts.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Plant Disease Diagnosis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Covers 38 distinct PlantVillage foliar disease classes across Tomato, Potato, Corn, Apple, Grape, Pepper, Peach, and Cherry with high calibrated confidence.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Crop-Conditioned Filtering</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Allows farmers to specify their crop (e.g. Tomato or Potato). The system mathematically conditions the logit masking to suppress cross-crop false positives.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Lesion Severity Quantification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Extracts the exact boundary of the leaf and computes lesion pixel ratios to classify damage into Healthy, Mild, Moderate, Severe, or Critical with a visual overlay.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Weather-Driven Spread Risk</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connects live GPS coordinates to meteorological forecasts (temperature, relative humidity, rain probability) to assess spore germination and disease spread likelihood.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Soil Health Card OCR</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Extracts NPK nutrients, pH, Electrical Conductivity, and micronutrients directly from physical Soil Health Cards to flag deficiencies and recommend fertilizers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Multilingual Voice Advisory</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Synthesizes complete diagnostic summaries and spray guidelines into native voice audio across Hindi, Punjabi, Marathi, Telugu, Tamil, and English.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* 6. TECHNOLOGY & AI SECTION */}
      <section id="technology" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Technical Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Powered by Proven AI & Computer Vision
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Inspect our production-grade stack built for high-throughput inference and low resource overhead.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">PyTorch & MobileNetV3</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lightweight convolutional architecture fine-tuned for high-accuracy foliar image classification with low memory consumption on CPU and edge devices.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">OpenCV Foliar Pipeline</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Color-space conversion to HSV and LAB, Excess Green Index (ExG = 2G - R - B), morphological filtering, and contour lesion area calculation.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">FastAPI Microservices</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asynchronous Python backend with pydantic data validation, sub-second response times, and automated Swagger/OpenAPI documentation.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Tesseract OCR</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated optical character recognition parsing nitrogen, phosphorus, potassium, and micronutrient metrics from photographed soil test sheets.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">React & Tailwind CSS</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modular component architecture featuring Leaflet geographic maps, canvas confetti celebrations for healthy crops, and responsive mobile layouts.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">PBKDF2-SHA256 Auth</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographically salted 100,000-iteration key derivation with 256-bit secure session tokens and server-side token revocation.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* 7. AGRICULTURAL IMPACT SECTION */}
      <section id="impact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Empowering Farmers Nationwide</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Built to Bridge the Gap in Agronomic Extension Services
              </h2>

              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Rural agricultural extension officers are stretched thin, with thousands of farms per advisor. KisanArogya AI puts an always-available agronomist directly in the farmer's pocket—reducing crop destruction, mitigating unnecessary chemical expenditure, and safeguarding food security.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Immediate localized recommendations</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Organic alternatives alongside chemical options</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complete privacy with secure credentials</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <Sprout className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Start Protecting Your Crops Today
          </h2>

          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Create an account or login to access the full diagnostic suite, disease severity heatmaps, soil testing, and outbreak tracking.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartClick}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base px-9 py-4 rounded-2xl shadow-xl shadow-emerald-600/25 transition active:scale-95"
            >
              <span>Analyze Your Plant</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base px-8 py-4 rounded-2xl shadow-xs transition"
            >
              <span>Sign In to Existing Account</span>
            </Link>
          </div>
        </div>
      </section>


      {/* 9. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900">Kisan<span className="text-emerald-600">Arogya</span> AI</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Multimodal Agricultural Artificial Intelligence Platform combining deep learning disease identification, computer vision lesion quantification, and weather-driven epidemiological forecasting.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition">About System</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition">How It Works</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 transition">Platform Features</button></li>
                <li><button onClick={() => scrollToSection('technology')} className="hover:text-emerald-600 transition">AI Architecture</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/login" className="hover:text-emerald-600 transition">Farmer Login</Link></li>
                <li><Link to="/register" className="hover:text-emerald-600 transition">Register New Account</Link></li>
                <li><button onClick={handleStartClick} className="hover:text-emerald-600 transition">Diagnostic Dashboard</button></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} KisanArogya AI. Built for Smart India Hackathon & Agricultural Advancement.</p>
            <p className="flex items-center space-x-2">
              <span>Powered by MobileNetV3</span>
              <span>•</span>
              <span>OpenCV</span>
              <span>•</span>
              <span>FastAPI</span>
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
