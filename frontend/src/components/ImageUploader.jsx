import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Camera, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  SwitchCamera, 
  AlertCircle,
  CameraOff,
  Leaf
} from 'lucide-react';

const PRELOADED_SAMPLES = [
  {
    id: 'tomato_early_blight',
    name: 'Tomato Early Blight',
    crop: 'Tomato',
    badge: 'Fungal Blight',
    filename: 'tomato_early_blight.jpg',
    url: '/static/samples/tomato_early_blight.jpg'
  },
  {
    id: 'potato_late_blight',
    name: 'Potato Late Blight',
    crop: 'Potato',
    badge: 'Critical Oomycete',
    filename: 'potato_late_blight.jpg',
    url: '/static/samples/potato_late_blight.jpg'
  },
  {
    id: 'corn_common_rust',
    name: 'Corn Common Rust',
    crop: 'Corn (Maize)',
    badge: 'Rust Pustules',
    filename: 'corn_common_rust.jpg',
    url: '/static/samples/corn_common_rust.jpg'
  },
  {
    id: 'healthy_tomato',
    name: 'Healthy Tomato Leaf',
    crop: 'Tomato',
    badge: '100% Healthy',
    filename: 'healthy_tomato.jpg',
    url: '/static/samples/healthy_tomato.jpg'
  },
  {
    id: 'pepper_bacterial_spot',
    name: 'Pepper Bacterial Spot',
    crop: 'Bell Pepper',
    badge: 'Bacterial',
    filename: 'pepper_bacterial_spot.jpg',
    url: '/static/samples/pepper_bacterial_spot.jpg'
  }
];

// All supported PlantVillage crops
const SUPPORTED_CROPS = [
  { key: 'Tomato', icon: '🍅', label: 'Tomato', hi: 'टमाटर' },
  { key: 'Potato', icon: '🥔', label: 'Potato', hi: 'आलू' },
  { key: 'Corn', icon: '🌽', label: 'Corn / Maize', hi: 'मक्का' },
  { key: 'Pepper', icon: '🌶️', label: 'Bell Pepper / Chilli', hi: 'मिर्च' },
  { key: 'Apple', icon: '🍎', label: 'Apple', hi: 'सेब' },
  { key: 'Grape', icon: '🍇', label: 'Grape', hi: 'अंगूर' },
  { key: 'Strawberry', icon: '🍓', label: 'Strawberry', hi: 'स्ट्रॉबेरी' },
  { key: 'Peach', icon: '🍑', label: 'Peach', hi: 'आड़ू' },
  { key: 'Cherry', icon: '🍒', label: 'Cherry', hi: 'चेरी' },
  { key: 'Orange', icon: '🍊', label: 'Orange / Citrus', hi: 'संतरा' },
  { key: 'Soybean', icon: '🌿', label: 'Soybean', hi: 'सोयाबीन' },
  { key: 'Squash', icon: '🎃', label: 'Squash', hi: 'कद्दू' },
  { key: 'Blueberry', icon: '🫐', label: 'Blueberry', hi: 'ब्लूबेरी' },
  { key: 'Raspberry', icon: '🍓', label: 'Raspberry', hi: 'रास्पबेरी' },
];

export default function ImageUploader({ 
  onImageSelected, onSampleSelected, isAnalyzing, 
  location, setLocation, selectedCrop, setSelectedCrop, t 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Live Camera Viewfinder State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [cameraError, setCameraError] = useState('');
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Crop selector
  const [cropSelectorOpen, setCropSelectorOpen] = useState(false);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => { stopCameraStream(); };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const closeCameraModal = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError('');
    setIsStartingCamera(false);
  };

  const openCameraModal = async (facing = 'environment') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    setIsCameraOpen(true);
    setCameraError('');
    setIsStartingCamera(true);
    setCameraFacing(facing);
    stopCameraStream();

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? "Camera permission was denied. Please allow camera access in your browser or select an image file directly."
          : `Camera error: ${err.message || 'Unable to open camera.'}`
      );
    } finally {
      setIsStartingCamera(false);
    }
  };

  const switchCameraFacing = () => openCameraModal(cameraFacing === 'environment' ? 'user' : 'environment');

  const capturePhotoFromCamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera_leaf_${Date.now()}.jpg`, { type: 'image/jpeg' });
        closeCameraModal();
        setSelectedSample(null);
        onImageSelected(file);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedSample(null);
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedSample(null);
      onImageSelected(e.target.files[0]);
    }
  };

  const handleSampleClick = (sample) => {
    setSelectedSample(sample.id);
    onSampleSelected(sample);
  };

  const detectGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          name: 'Current Farm Location'
        }),
        () => alert('Location permission denied or unavailable. Using default agricultural zone coordinates.')
      );
    }
  };

  const activeCropLabel = selectedCrop
    ? (SUPPORTED_CROPS.find(c => c.key === selectedCrop)?.label || selectedCrop)
    : (t.all_crops || 'Auto-Detect / All Crops');

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 p-5 sm:p-7 shadow-sm transition-all">
      
      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Location Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">Farm Location:</span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
            {location.latitude}° N, {location.longitude}° E
          </span>
        </div>
        <button
          onClick={detectGPS}
          className="flex items-center space-x-1.5 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Auto-Detect GPS</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════
          CROP SELECTION PANEL
          ═══════════════════════════════════════════ */}
      <div className="mb-5 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-extrabold text-slate-800">
                {t.select_crop_title || 'Which crop is this?'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 ml-6">
              {t.select_crop_subtitle || 'Select crop to restrict analysis to relevant diseases'}
            </p>
          </div>
          {selectedCrop && (
            <button
              onClick={() => setSelectedCrop(null)}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Currently selected crop badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold text-slate-500">Selected:</span>
          <span className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
            selectedCrop 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-200 text-slate-600'
          }`}>
            {selectedCrop ? (SUPPORTED_CROPS.find(c => c.key === selectedCrop)?.icon || '🌿') : '🔍'}
            <span>{activeCropLabel}</span>
          </span>
        </div>

        {/* Crop grid toggle */}
        <button
          onClick={() => setCropSelectorOpen(!cropSelectorOpen)}
          className="text-[11px] font-semibold text-emerald-700 underline underline-offset-2"
        >
          {cropSelectorOpen ? '▲ Hide crop list' : '▼ Show all crops'}
        </button>

        {cropSelectorOpen && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
            {/* Auto-detect option */}
            <button
              onClick={() => { setSelectedCrop(null); setCropSelectorOpen(false); }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all text-[10px] font-semibold ${
                !selectedCrop 
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/30 text-emerald-800' 
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-slate-600'
              }`}
            >
              <span className="text-xl mb-1">🔍</span>
              <span>Auto</span>
            </button>

            {SUPPORTED_CROPS.map((crop) => (
              <button
                key={crop.key}
                onClick={() => { setSelectedCrop(crop.key); setCropSelectorOpen(false); }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all text-[10px] font-semibold ${
                  selectedCrop === crop.key 
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/30 text-emerald-800' 
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-slate-600'
                }`}
              >
                <span className="text-xl mb-1">{crop.icon}</span>
                <span className="line-clamp-1">{crop.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
            : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/70'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-1">{t.btn_upload}</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">{t.drop_hint}</p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openCameraModal('environment'); }}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera</span>
          </button>
          <span className="text-xs text-slate-400 font-medium">or Browse Gallery</span>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 text-white">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-extrabold text-sm sm:text-base">Live Crop Camera</h4>
                {selectedCrop && (
                  <span className="text-[10px] bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    {SUPPORTED_CROPS.find(c => c.key === selectedCrop)?.icon} {selectedCrop}
                  </span>
                )}
              </div>
              <button onClick={closeCameraModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport */}
            <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover max-h-[60vh]" />

              {/* Viewfinder Reticle */}
              {!cameraError && !isStartingCamera && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  <div className="w-4/5 h-4/5 border-2 border-dashed border-emerald-400/70 rounded-2xl relative shadow-inner">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-emerald-400 -mt-0.5 -ml-0.5 rounded-tl-sm" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-emerald-400 -mt-0.5 -mr-0.5 rounded-tr-sm" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-emerald-400 -mb-0.5 -ml-0.5 rounded-bl-sm" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-emerald-400 -mb-0.5 -mr-0.5 rounded-br-sm" />
                  </div>
                  <span className="mt-3 bg-slate-950/75 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                    Align crop leaf inside the frame
                  </span>
                </div>
              )}

              {isStartingCamera && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-xs font-semibold">Starting camera...</p>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <CameraOff className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-sm text-rose-300">Camera Unavailable</h5>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{cameraError}</p>
                  <button
                    onClick={() => { closeCameraModal(); cameraInputRef.current?.click(); }}
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Select Photo from Files Instead
                  </button>
                </div>
              )}
            </div>

            {/* Modal Controls Bar */}
            <div className="bg-slate-900 px-5 py-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={switchCameraFacing}
                disabled={!!cameraError || isStartingCamera}
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition disabled:opacity-40"
              >
                <SwitchCamera className="w-4 h-4" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>

              <button
                type="button"
                onClick={capturePhotoFromCamera}
                disabled={!!cameraError || isStartingCamera}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-6 py-2.5 rounded-full shadow-lg shadow-emerald-500/25 transition active:scale-95 disabled:opacity-40"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Leaf</span>
              </button>

              <button
                type="button"
                onClick={closeCameraModal}
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-loaded 1-Click Sample Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">{t.btn_try_samples}:</span>
          </div>
          <span className="text-[11px] text-slate-400">Click any card to diagnose instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRELOADED_SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSampleClick(s)}
              disabled={isAnalyzing}
              className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                selectedSample === s.id
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.crop}</span>
                {selectedSample === s.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{s.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  s.badge.includes('Healthy') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {s.badge}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Test →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
