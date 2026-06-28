import React, { useState, useRef } from 'react';
import { UploadCloud, MapPin, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import InteractiveMap from './InteractiveMap';

interface PageReportProps {
  onReportIssue: (data: { 
    image: string; 
    location: string; 
    description: string; 
    latitude?: number; 
    longitude?: number; 
    area?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    locationType?: string;
    aiVerificationReport?: any;
  }) => Promise<void>;
  isSubmitting: boolean;
  userEmail: string;
  onNavigateHome: () => void;
}

export default function PageReport({
  onReportIssue,
  isSubmitting: externalIsSubmitting,
  userEmail,
  onNavigateHome
}: PageReportProps) {
  // Input fields
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Map & Coordinates
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [locationType, setLocationType] = useState<string | undefined>(undefined);
  const [area, setArea] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [postalCode, setPostalCode] = useState<string | undefined>(undefined);
  const [isLocating, setIsLocating] = useState(false);

  // Submission loading indicator
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await handleMapLocationChange(lat, lng);
        setIsLocating(false);
      },
      (geoError) => {
        console.error('GPS lookup rejected:', geoError);
        setError('Location permission denied or unavailable. Please click on the map to set your location.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMapLocationChange = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setError(null);

    // Dynamic reverse-geocoding (client-side metadata fallback)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          setLocation(data.display_name);
        }
        if (data.address) {
          const addr = data.address;
          setArea(addr.suburb || addr.neighbourhood || addr.residential || addr.subdivision);
          setCity(addr.city || addr.town || addr.village);
          setState(addr.state);
          setPostalCode(addr.postcode);
          setLocationType(data.type || data.addresstype);
        }
      }
    } catch (err) {
      console.warn('OSM reverse geocoding failed, using coordinates');
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files (PNG, JPG, WEBP) are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageBlob(reader.result as string);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBlob) {
      setError('An image upload is required to submit a municipal report.');
      return;
    }
    if (!location.trim()) {
      setError('Please specify the location address or select it on the map.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a brief description of the incident.');
      return;
    }

    setError(null);
    setInternalIsSubmitting(true);

    try {
      // Step 1: Run analytical verification behind the scenes
      const res = await fetch('/api/issues/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBlob,
          location,
          description,
          latitude,
          longitude
        })
      });

      let aiVerificationReport = null;
      if (res.ok) {
        const data = await res.json();
        aiVerificationReport = data.report;
      }

      // Step 2: Submit report immediately with the hidden AI analysis attached
      await onReportIssue({
        image: imageBlob,
        location,
        description,
        latitude,
        longitude,
        area,
        city,
        state,
        postalCode,
        locationType,
        aiVerificationReport
      });

      setSuccess(true);
      
      // Clean up fields
      setLocation('');
      setDescription('');
      setImageBlob(null);
      setLatitude(undefined);
      setLongitude(undefined);

      setTimeout(() => {
        setSuccess(false);
        onNavigateHome();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to file municipal report. Please try again.');
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  const loading = internalIsSubmitting || externalIsSubmitting;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in" id="page-report-root">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateHome}
            disabled={loading}
            className="text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-50 transition-all font-mono uppercase bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg active:scale-95 cursor-pointer"
          >
            &larr; Return Home
          </button>
          <div>
            <h1 className="text-xl font-bold text-white font-sans">Submit Civic Report</h1>
            <p className="text-xs text-slate-400 font-sans">Report infrastructure defects directly to city services</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitReport} className="bg-[#09090B] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
        
        {/* Photo Evidence upload zone */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Photographic Evidence (Required)</label>
          {!imageBlob ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-500/5' 
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              id="report-image-dropzone"
            >
              <UploadCloud className="w-10 h-10 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-slate-300">Drag & drop defect photo, or <span className="text-indigo-400 underline">browse files</span></p>
                <p className="text-xs text-slate-500 mt-1">Accepts PNG, JPG, or WEBP images</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-[280px] bg-black flex items-center justify-center">
              <img src={imageBlob} alt="Incident preview" className="object-contain max-h-[280px] w-full" referrerPolicy="no-referrer" />
              <button 
                type="button" 
                onClick={() => setImageBlob(null)}
                disabled={loading}
                className="absolute top-3 right-3 bg-black/80 hover:bg-black border border-white/10 text-slate-300 hover:text-white p-2 rounded-full transition-all shadow cursor-pointer"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Location Section with Map pinpoint */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Street Address / Location</label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating || loading}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-all flex items-center space-x-1 bg-indigo-500/5 border border-indigo-500/10 px-2 py-1 rounded-lg"
                id="detect-gps-btn"
              >
                {isLocating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                    <span>Detecting location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 animate-pulse" />
                    <span>Get GPS Location</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter closest landmark or street address"
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500 text-sm rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-mono uppercase tracking-wider text-slate-400">Pinpoint on Map</span>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <InteractiveMap 
                latitude={latitude}
                longitude={longitude}
                onChangeLocation={handleMapLocationChange}
                isDraggable={true}
                height="220px"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Description of issue</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Explain the damage size, safety risks, or duration to assist municipal engineers..."
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500 text-sm rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans leading-relaxed"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Incident filed successfully! Creating dispatch ticket...</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-98 shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          id="confirm-submit-btn"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Filing incident report & dispatching...</span>
            </>
          ) : (
            <span>Submit Municipal Report</span>
          )}
        </button>

      </form>

    </div>
  );
}
