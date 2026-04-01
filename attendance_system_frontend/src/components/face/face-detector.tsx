// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { CircleAlert as AlertCircle, ChartBar as BarChart3, Loader as Loader2 } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import { Progress } from '../../components/ui/progress';
// import { initializeFaceAPI, detectFaceAndGetDescriptor, compareFaces, arrayToDescriptor } from '@/lib/face-api';

// interface FaceDetectorProps {
//   onSuccess: (matched: boolean, confidence: number) => void;
//   storedFaceData: number[];
//   isLoading?: boolean;
// }

// export function FaceDetector({
//   onSuccess,
//   storedFaceData,
//   isLoading = false,
// }: FaceDetectorProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [initialized, setInitialized] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [faceDetected, setFaceDetected] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [confidence, setConfidence] = useState(0);
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

//               if (detection?.descriptor) {
//                 setFaceDetected(true);

//                 try {
//                   const storedDescriptor = arrayToDescriptor(storedFaceData);
//                   const result = await compareFaces(detection.descriptor, storedDescriptor);
//                   setConfidence(result.confidence);

//                   if (result.isMatch) {
//                     setIsProcessing(true);
//                     setTimeout(() => {
//                       onSuccess(true, result.confidence);
//                       setIsProcessing(false);
//                     }, 800);
//                   }
//                 } catch (err) {
//                   console.error('Face comparison error:', err);
//                 }
//               } else {
//                 setFaceDetected(false);
//                 setConfidence(0);
//               }
//             }
//           }, 500);
//         }
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Failed to access camera';
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
//   }, [storedFaceData, onSuccess]);

//   return (
//     <div className="w-full space-y-4">
//       <div>
//         <h3 className="text-lg font-semibold text-slate-900">Face Login</h3>
//         <p className="text-sm text-slate-600 mt-1">Position your face in the center for verification</p>
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
//               <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-3" />
//               <p className="text-white text-sm font-medium">Loading face detection...</p>
//             </div>
//           </div>
//         )}

//         {initialized && faceDetected && confidence > 0 && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
//             <div className="bg-white/95 rounded-lg p-6 shadow-xl max-w-xs">
//               <div className="flex items-center gap-2 mb-3">
//                 <BarChart3 className="w-5 h-5 text-blue-600" />
//                 <span className="font-semibold text-slate-900">Match Confidence</span>
//               </div>
//               <Progress value={confidence} className="h-2 mb-2" />
//               <p className="text-2xl font-bold text-blue-600">{confidence}%</p>
//               {confidence >= 60 && (
//                 <p className="text-xs text-green-600 font-medium mt-2">
//                   ✓ Match confirmed
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {initialized && !faceDetected && (
//           <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//             Position your face
//           </div>
//         )}

//         {isProcessing && (
//           <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
//             <div className="bg-green-50 rounded-lg p-6 shadow-xl">
//               <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
//               <p className="text-sm font-medium text-green-900">Verifying...</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <p className="text-sm text-blue-900">
//           <strong>Tip:</strong> Ensure good lighting and keep your face centered for accurate recognition.
//         </p>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FaceDetectorProps {
  onCapture: (imageBase64: string) => void;
  isLoading?: boolean;
}

export function FaceDetector({ onCapture, isLoading }: FaceDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setInitialized(true);
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
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg');

    onCapture(base64);
  };

  return (
    <div className="space-y-4">

      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full"
        />
        <canvas ref={canvasRef} className="hidden" />

        {!initialized && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" />
          </div>
        )}
      </div>

      <Button
        onClick={captureImage}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Capture & Verify'}
      </Button>

    </div>
  );
}