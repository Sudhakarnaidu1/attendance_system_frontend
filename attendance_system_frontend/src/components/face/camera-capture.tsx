'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export function CameraCapture({
  onCapture,
  isLoading = false,
  title = 'Capture Your Face',
  description = 'Position your face in the center of the frame',
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      setInitialized(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setInitialized(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access camera';
      setError(`Camera error: ${message}`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setInitialized(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      setError('Camera not ready yet. Please wait.');
      return;
    }

    try {
      setIsCapturing(true);

      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      const base64Image = canvas.toDataURL('image/jpeg', 0.95);

      // stop camera after capture
      stopCamera();

      onCapture(base64Image);

    } catch (err) {
      setError('Failed to capture image. Please retry.');
    } finally {
      setIsCapturing(false);
    }
  };

  // ✅ properly restarts camera on retry
  const handleRetry = () => startCamera();

  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-white/10">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />

        {/* initializing overlay */}
        {!initialized && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <p className="text-white text-sm">Initializing camera...</p>
            </div>
          </div>
        )}

        {/* face guide */}
        {initialized && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-56 border-2 border-cyan-400/60 rounded-full" />
          </div>
        )}

        {/* processing overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center space-y-3">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
              <p className="text-white text-sm">Processing...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleCapture}
          disabled={!initialized || isCapturing || isLoading}
          className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl"
        >
          {isCapturing || isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isCapturing ? 'Capturing...' : 'Processing...'}
            </span>
          ) : (
            'Capture Face'
          )}
        </Button>

        {error && (
          <Button
            onClick={handleRetry}
            variant="outline"
            className="px-4 border-white/20 text-slate-300 hover:bg-white/10 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}