// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { CircleAlert as AlertCircle, Camera, RefreshCw } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { initializeFaceAPI, detectFaceAndGetDescriptor } from '@/lib/face-api';

// interface CameraCaptureProps {
//   onCapture: (descriptor: Float32Array) => void;
//   isLoading?: boolean;
//   title?: string;
//   description?: string;
// }

// export function CameraCapture({
//   onCapture,
//   isLoading = false,
//   title = 'Capture Your Face',
//   description = 'Position your face in the center of the frame for optimal results',
// }: CameraCaptureProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [initialized, setInitialized] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [faceDetected, setFaceDetected] = useState(false);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const detectionIntervalRef = useRef<NodeJS.Timeout>();

//   useEffect(() => {
//     const initializeCamera = async () => {
//       try {
//         setError(null);
//         const initialized = await initializeFaceAPI();

//         if (!initialized) {
//           setError('Failed to load face recognition models. Please check your internet connection.');
//           return;
//         }

//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             width: { ideal: 640 },
//             height: { ideal: 480 },
//             facingMode: 'user',
//           },
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           setInitialized(true);

//           detectionIntervalRef.current = setInterval(async () => {
//             if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
//               const detection = await detectFaceAndGetDescriptor(videoRef.current);
//               setFaceDetected(!!detection);
//             }
//           }, 500);
//         }
//       } catch (err) {
//         const message =
//           err instanceof Error ? err.message : 'Failed to access camera';
//         setError(`Camera access denied: ${message}. Please check permissions.`);
//       }
//     };

//     initializeCamera();

//     return () => {
//       if (detectionIntervalRef.current) {
//         clearInterval(detectionIntervalRef.current);
//       }
//       if (videoRef.current?.srcObject) {
//         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const handleCapture = async () => {
//     if (!videoRef.current || !initialized) return;

//     try {
//       setIsCapturing(true);
//       const detection = await detectFaceAndGetDescriptor(videoRef.current);

//       if (!detection?.descriptor) {
//         setError('No face detected. Please ensure your face is visible and try again.');
//         setIsCapturing(false);
//         return;
//       }

//       onCapture(detection.descriptor);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to capture face');
//     } finally {
//       setIsCapturing(false);
//     }
//   };

//   const handleRetry = () => {
//     setError(null);
//     setFaceDetected(false);
//   };

//   return (
//     <div className="w-full space-y-4">
//       <div>
//         <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
//         <p className="text-sm text-slate-600 mt-1">{description}</p>
//       </div>

//       <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video shadow-lg border-2 border-slate-200">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="w-full h-full object-cover"
//         />
//         <canvas ref={canvasRef} className="hidden" />

//         {!initialized && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//             <div className="text-center">
//               <div className="inline-block p-3 bg-blue-600 rounded-full mb-3">
//                 <Camera className="w-6 h-6 text-white animate-pulse" />
//               </div>
//               <p className="text-white text-sm font-medium">Initializing camera...</p>
//             </div>
//           </div>
//         )}

//         {initialized && faceDetected && (
//           <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//             Face detected
//           </div>
//         )}

//         {initialized && !faceDetected && (
//           <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//             Position your face
//           </div>
//         )}
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="flex gap-3">
//         <Button
//           onClick={handleCapture}
//           disabled={!initialized || !faceDetected || isCapturing || isLoading}
//           className="flex-1 bg-blue-600 hover:bg-blue-700"
//         >
//           {isCapturing ? 'Capturing...' : 'Capture Face'}
//         </Button>
//         {error && (
//           <Button
//             onClick={handleRetry}
//             variant="outline"
//             className="px-6"
//           >
//             <RefreshCw className="w-4 h-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import { CircleAlert as AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  /* =========================
     START CAMERA
  ========================= */
  useEffect(() => {
    const startCamera = async () => {
      try {
        setError(null);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setInitialized(true);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to access camera';
        setError(`Camera error: ${message}`);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  /* =========================
     CAPTURE IMAGE
  ========================= */
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsCapturing(true);

      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      const base64Image = canvas.toDataURL('image/jpeg');

      // 🔥 Send to parent (login/register)
      onCapture(base64Image);

    } catch (err) {
      setError('Failed to capture image');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="w-full space-y-4">

      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>

      {/* Camera View */}
      <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video shadow-lg border-2 border-slate-200">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {!initialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <div className="inline-block p-3 bg-blue-600 rounded-full mb-3">
                <Camera className="w-6 h-6 text-white animate-pulse" />
              </div>
              <p className="text-white text-sm font-medium">
                Initializing camera...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleCapture}
          disabled={!initialized || isCapturing || isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isCapturing ? 'Capturing...' : 'Capture Face'}
        </Button>

        {error && (
          <Button onClick={handleRetry} variant="outline" className="px-6">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}