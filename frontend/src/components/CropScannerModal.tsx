import React, { useState, useRef, useEffect } from 'react';
import {
  ScanLine, X, Camera, Upload, CheckCircle2, AlertTriangle, RefreshCw,
  Sparkles, Image as ImageIcon, ShieldAlert, Video, VideoOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { diagnoseCropImageWithGemini, recommendPesticidesWithGemini } from '../services/gemini';
import { CropGridSelector } from './CropGridSelector';
import type { AIDiagnosticResult } from '../types';

export const CropScannerModal: React.FC = () => {
  const { isScannerModalOpen, setIsScannerModalOpen } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [userNotes, setUserNotes] = useState('');
  const [scanMode, setScanMode] = useState<'CAMERA' | 'UPLOAD'>('UPLOAD');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AIDiagnosticResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when modal closes or mode changes
  useEffect(() => {
    if (!isScannerModalOpen || scanMode !== 'CAMERA') {
      stopCamera();
    }
  }, [isScannerModalOpen, scanMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Camera access could not be established. Please use the Upload Image option or verify browser permissions.');
      setScanMode('UPLOAD');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunScan = async () => {
    setIsScanning(true);
    setResult(null);
    try {
      if (imagePreview) {
        // Run multimodal vision diagnosis with Gemini Vision
        const diag = await diagnoseCropImageWithGemini(imagePreview, selectedCrop, userNotes);
        setResult(diag);
      } else {
        // Fallback to text diagnosis if no photo selected
        const diag = await recommendPesticidesWithGemini(selectedCrop, userNotes);
        setResult(diag);
      }
    } catch (err) {
      console.error('Error scanning crop health:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setResult(null);
    if (scanMode === 'CAMERA') {
      startCamera();
    }
  };

  if (!isScannerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-neutral-900 text-white rounded-xl shadow-md border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ScanLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg tracking-tight">AI Crop Health Scanner</h3>
                <span className="text-xs bg-emerald-950/60 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-normal">Visual Leaf, Disease & Pest Diagnosis</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setIsScannerModalOpen(false);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Crop Selector */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
            <CropGridSelector
              selectedCrop={selectedCrop}
              onSelectCrop={(name) => setSelectedCrop(name)}
            />

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Symptoms / Observations (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Yellowing leaf edges, black spots on undersides, wilting..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/15 focus:border-emerald-400 outline-none bg-black/40 text-white font-medium placeholder-neutral-500"
              />
            </div>
          </div>

          {/* Mode Selector Tabs (Camera vs Upload) */}
          <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setScanMode('UPLOAD');
                stopCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                scanMode === 'UPLOAD'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScanMode('CAMERA');
                setImagePreview(null);
                startCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                scanMode === 'CAMERA'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera Scanner</span>
            </button>
          </div>

          {/* Capture / Upload Area */}
          <div className="relative rounded-xl border-2 border-dashed border-white/20 bg-black/30 p-4 sm:p-6 text-center flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
            
            {/* 1. Live Camera Feed */}
            {scanMode === 'CAMERA' && !imagePreview && (
              <div className="w-full flex flex-col items-center space-y-3">
                <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-black border border-white/20 shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Visual Viewfinder Frame */}
                  <div className="absolute inset-4 border border-emerald-400/50 rounded-lg pointer-events-none flex items-center justify-center">
                    <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
                    <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
                    <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
                    <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
                    <span className="text-xs text-emerald-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                      Align Affected Leaf / Plant
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={!isCameraActive}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Snapshot</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. File Upload Box */}
            {scanMode === 'UPLOAD' && !imagePreview && (
              <div className="w-full flex flex-col items-center py-4 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-all group"
                >
                  <Upload className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Click to Upload Crop Photo</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                    Supports JPEG, PNG, WEBP. Select a high-resolution close-up of infected leaves or stems.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all"
                >
                  Select File from Device
                </button>
              </div>
            )}

            {/* 3. Image Preview when Photo is captured or uploaded */}
            {imagePreview && (
              <div className="w-full flex flex-col items-center space-y-3">
                <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-md">
                  <img src={imagePreview} alt="Crop sample" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    Ready for AI
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-semibold rounded-lg transition-all"
                  >
                    Retake / Change Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Gemini AI Analyzing Foliage & Pathogens...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                  <span>Diagnose {selectedCrop} Health with Gemini AI</span>
                </>
              )}
            </button>
          </div>

          {/* Diagnostic Results Display */}
          {result && (
            <div className="bg-white/5 p-5 rounded-xl border border-emerald-500/30 space-y-4 animate-in slide-in-from-bottom-2 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    Diagnosis Match
                  </span>
                  <h4 className="text-lg font-black text-white mt-1.5">{result.diseaseName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {result.confidencePercent}%
                  </span>
                  <p className="text-xs text-neutral-400 font-medium">Confidence</p>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Observed Symptoms
                </span>
                <ul className="space-y-1 text-xs text-neutral-300 pl-2">
                  {result.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* IPM Prevention Measures */}
              {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
                <div className="space-y-1.5 bg-black/30 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Integrated Pest Management (IPM) & Prevention
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-300 pl-2">
                    {result.preventiveMeasures.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatment Guidance */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Verified Treatment Guidance
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-300 pl-2">
                  {result.treatmentPlan.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-400 mt-0.5">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety & Official Verification Notice */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Official Verification Required:</strong> AI diagnosis is advisory. Always cross-check with local Agricultural Extension Officers / KVK and consult the CIB&RC / PPQS registered label before chemical pesticide spray.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
