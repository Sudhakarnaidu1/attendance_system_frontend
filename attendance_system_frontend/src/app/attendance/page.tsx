// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Camera, UserPlus, LogIn, CheckCircle, Clock, Users, ShieldCheck } from 'lucide-react';
// import { FaceDetector } from '../../components/face/face-detector';
// import { toast } from '../../hooks/use-toast';
// import { Header } from '@/components/layouts/header';

// type AttendanceStep = 'idle' | 'scanning' | 'success' | 'error';

// export default function AttendancePage() {
//   const [step, setStep] = useState<AttendanceStep>('idle');
//   const [isLoading, setIsLoading] = useState(false);
//   const [markedUser, setMarkedUser] = useState<{ name: string; employee_id: string } | null>(null);
//   const [currentTime, setCurrentTime] = useState<Date | null>(null);
//   const [stats, setStats] = useState({
//     total_users: '--',
//     today_present: '--',
//     avg_checkin: '--:--'
//   });

//   useEffect(() => {
//     setCurrentTime(new Date());
//   }, []);

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         const res = await fetch('http://localhost:8000/api/stats/');
//         const data = await res.json();

//         setStats({
//           total_users: data.total_users,
//           today_present: data.today_present,
//           avg_checkin: data.avg_checkin,
//         });
//       } catch (err) {
//         console.error('Failed to load stats');
//       }
//     };

//     loadStats();
//   }, []);

//   const handleFaceCapture = async (imageBase64: string) => {
//     setStep('scanning');
//     setIsLoading(true);

//     try {
//       const res = await fetch('http://localhost:8000/api/mark-attendance/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ image: imageBase64 }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         toast({
//           title: "Error",
//           description: data.message || "Face not recognized",
//           variant: "destructive",
//         });
//         setStep('error');
//         setIsLoading(false);
//         return;
//       }
//       toast({
//         title: "Success",
//         description: "Face recognized, marking attendance...",
//       });

//       setMarkedUser(data.user);
//       setStep('success');
//       toast({
//         title: "Success",
//         description: `Attendance marked for ${data.user.name}`,
//       });
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: 'Failed to mark attendance. Please try again.',
//         variant: "destructive",
//       });
//       setStep('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setStep('idle');
//     setMarkedUser(null);
//   };

//   const formatDate = (date: Date) =>
//     date.toLocaleDateString('en-IN', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });

//   const formatTime = (date: Date) =>
//     date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true,
//     });

//   return (
//     <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
//       {/* ─── Header ─── */}
//       <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
//               <Camera className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-lg font-bold tracking-tight">MarkYourAttendance</span>
//           </div>
//           <nav className="flex items-center gap-2">
//             <Link
//               href="/login"
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
//             >
//               <LogIn className="w-4 h-4" />
//               Login
//             </Link>
//             <Link
//               href="/register"
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-white transition-all shadow-lg shadow-cyan-500/20"
//             >
//               <UserPlus className="w-4 h-4" />
//               Register
//             </Link>
//           </nav>
//         </div>
//       </header>
//       {/* <Header /> */}

//       <main className="max-w-7xl mx-auto px-6 py-12">
//         {/* ─── Hero ─── */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-4">
//             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
//             Live Attendance System
//           </div>
//           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">
//             Mark Your{' '}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//               Attendance
//             </span>
//           </h1>
//           <p className="text-slate-400 text-lg max-w-xl mx-auto">
//             Look at the camera and click the button. Our AI will identify you instantly.
//           </p>
//           <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
//             <span className="flex items-center gap-1.5">
//               <Clock className="w-4 h-4 text-slate-400" />
//               {currentTime ? formatTime(currentTime) : '--:--:--'}
//             </span>
//             <span className="w-1 h-1 rounded-full bg-slate-600" />
//             <span>{currentTime ? formatDate(currentTime) : '--/--/----'}</span>
//           </div>
//         </div>

//         {/* ─── Main Card ─── */}
//         <div className="max-w-2xl mx-auto">
//           {step === 'idle' && (
//             <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
//               <div className="p-6 border-b border-white/10 flex items-center justify-between">
//                 <div>
//                   <h2 className="font-bold text-lg">Face Scanner</h2>
//                   <p className="text-slate-400 text-sm mt-0.5">Position yourself clearly in the frame</p>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
//                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                   Ready
//                 </div>
//               </div>
//               <div className="p-6">
//                 <FaceDetector onCapture={handleFaceCapture} isLoading={isLoading} />
//               </div>
//             </div>
//           )}

//           {step === 'scanning' && (
//             <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-12 text-center shadow-2xl">
//               <div className="w-20 h-20 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto mb-6" />
//               <h2 className="text-2xl font-bold mb-2">Scanning Face...</h2>
//               <p className="text-slate-400">Please hold still</p>
//             </div>
//           )}

//           {step === 'success' && markedUser && (
//             <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden shadow-2xl text-center">
//               <div className="p-10 space-y-6">
//                 <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
//                   <CheckCircle className="w-10 h-10 text-emerald-400" />
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-extrabold text-emerald-400 mb-1">Attendance Marked!</h2>
//                   <p className="text-slate-400">Successfully verified and recorded</p>
//                 </div>
//                 <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-400">Name</span>
//                     <span className="font-semibold">{markedUser.name}</span>
//                   </div>
//                   <div className="border-t border-white/10" />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-400">Student ID</span>
//                     <span className="font-semibold">{markedUser.employee_id}</span>
//                   </div>
//                   <div className="border-t border-white/10" />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-400">Time</span>
//                     <span className="font-semibold">{currentTime ? formatTime(currentTime) : '--:--:--'}</span>
//                   </div>
//                   <div className="border-t border-white/10" />
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-400">Date</span>
//                     <span className="font-semibold">{currentTime ? formatDate(currentTime) : '--/--/----'}</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleReset}
//                   className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-all text-sm"
//                 >
//                   Mark Another
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 'error' && (
//             <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center shadow-2xl space-y-5">
//               <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto">
//                 <ShieldCheck className="w-10 h-10 text-red-400" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-red-400 mb-2">Face Not Recognized</h2>
//                 <p className="text-slate-400 text-sm">Make sure you're registered and well-lit</p>
//               </div>
//               <button
//                 onClick={handleReset}
//                 className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-all text-sm"
//               >
//                 Try Again
//               </button>
//             </div>
//           )}

//           {/* ─── Footer Links ─── */}
//           <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
//             <span>Not registered yet?</span>
//             <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
//               Create Account →
//             </Link>
//             <span>|</span>
//             <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
//               View My Attendance →
//             </Link>
//           </div>
//         </div>

//         {/* ─── Stats Row ─── */}
//         <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
//           {[
//             { icon: Users, label: 'Total Students', value: stats.total_users, color: 'cyan' },
//             { icon: CheckCircle, label: "Today's Present", value: stats.today_present, color: 'emerald' },
//             { icon: Clock, label: 'Avg Check-in', value: stats.avg_checkin, color: 'blue' },
//           ].map(({ icon: Icon, label, value, color }) => (
//             <div
//               key={label}
//               className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center gap-4"
//             >
//               <div
//                 className={`w-11 h-11 rounded-lg flex items-center justify-center ${
//                   color === 'cyan'
//                     ? 'bg-cyan-500/15 text-cyan-400'
//                     : color === 'emerald'
//                     ? 'bg-emerald-500/15 text-emerald-400'
//                     : 'bg-blue-500/15 text-blue-400'
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold">{value}</p>
//                 <p className="text-xs text-slate-500">{label}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Camera, UserPlus, LogIn, CheckCircle, Clock, Users, ShieldCheck } from 'lucide-react';
import { FaceDetector } from '../../components/face/face-detector';
import { toast } from '../../hooks/use-toast';

type AttendanceStep = 'idle' | 'success' | 'error';

export default function AttendancePage() {
  const [step, setStep] = useState<AttendanceStep>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [markedUser, setMarkedUser] = useState<{ name: string; employee_id: string } | null>(null);
  const [markedAt, setMarkedAt] = useState<Date | null>(null);   // ✅ fix stale time
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [stats, setStats] = useState({
    total_users: '--',
    today_present: '--',
    avg_checkin: '--:--',
  });

  // ✅ set current time on mount only (avoids hydration mismatch)
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  // ✅ load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/stats/');
        const data = await res.json();
        setStats({
          total_users: data.total_users,
          today_present: data.today_present,
          avg_checkin: data.avg_checkin,
        });
      } catch {
        console.error('Failed to load stats');
      }
    };
    loadStats();
  }, []);

  // ✅ KEY FIX: stop camera on page unmount (navigation away)
  useEffect(() => {
    return () => {
      // stop all active media tracks when leaving the page
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then(stream => stream.getTracks().forEach(t => t.stop()))
        .catch(() => {});
    };
  }, []);

  // ✅ fixed: no setStep('scanning') — camera stays mounted during API call
  const handleFaceCapture = useCallback(async (imageBase64: string) => {
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/mark-attendance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: 'Error',
          description: data.message || 'Face not recognized. Please try again.',
          variant: 'destructive',
        });
        setStep('error');
        return;
      }

      setMarkedUser(data.user);
      setMarkedAt(new Date()); // ✅ exact time of marking
      setStep('success');

      // ✅ single toast only
      toast({
        title: 'Attendance Marked!',
        description: `Welcome, ${data.user.name}!`,
      });

    } catch {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to server. Please try again.',
        variant: 'destructive',
      });
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setStep('idle');
    setMarkedUser(null);
    setMarkedAt(null);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* ─── Header ─── */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">MarkYourAttendance</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-white transition-all shadow-lg shadow-cyan-500/20"
            >
              <UserPlus className="w-4 h-4" /> Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* ─── Hero ─── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live Attendance System
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">
            Mark Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Attendance
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Look at the camera and click the button. Our AI will identify you instantly.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {currentTime ? formatTime(currentTime) : '--:--:--'}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>{currentTime ? formatDate(currentTime) : '--/--/----'}</span>
          </div>
        </div>

        {/* ─── Main Card ─── */}
        <div className="max-w-2xl mx-auto">

          {/* ✅ idle — FaceDetector stays mounted, isLoading overlay shown inside it */}
          {step === 'idle' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">Face Scanner</h2>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Position yourself clearly in the frame
                  </p>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1 border ${
                  isLoading
                    ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                    : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isLoading ? 'bg-yellow-400' : 'bg-emerald-400'
                  }`} />
                  {isLoading ? 'Scanning...' : 'Ready'}
                </div>
              </div>
              <div className="p-6">
                <FaceDetector onCapture={handleFaceCapture} isLoading={isLoading} />
              </div>
            </div>
          )}

          {/* ✅ success */}
          {step === 'success' && markedUser && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden shadow-2xl text-center">
              <div className="p-10 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-emerald-400 mb-1">
                    Attendance Marked!
                  </h2>
                  <p className="text-slate-400">Successfully verified and recorded</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Name</span>
                    <span className="font-semibold">{markedUser.name}</span>
                  </div>
                  <div className="border-t border-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Employee ID</span>
                    <span className="font-semibold">{markedUser.employee_id}</span>
                  </div>
                  <div className="border-t border-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Time</span>
                    {/* ✅ uses markedAt — exact time of attendance */}
                    <span className="font-semibold">
                      {markedAt ? formatTime(markedAt) : '--:--:--'}
                    </span>
                  </div>
                  <div className="border-t border-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Date</span>
                    <span className="font-semibold">
                      {markedAt ? formatDate(markedAt) : '--/--/----'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-all text-sm"
                >
                  Mark Another
                </button>
              </div>
            </div>
          )}

          {/* ✅ error */}
          {step === 'error' && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center shadow-2xl space-y-5">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Face Not Recognized</h2>
                <p className="text-slate-400 text-sm">
                  Make sure you're registered and well-lit
                </p>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-all text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ─── Footer Links ─── */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>Not registered yet?</span>
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Create Account →
            </Link>
            <span>|</span>
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              View My Attendance →
            </Link>
          </div>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            { icon: Users, label: 'Total Students', value: stats.total_users, color: 'cyan' },
            { icon: CheckCircle, label: "Today's Present", value: stats.today_present, color: 'emerald' },
            { icon: Clock, label: 'Avg Check-in', value: stats.avg_checkin, color: 'blue' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                color === 'cyan' ? 'bg-cyan-500/15 text-cyan-400'
                : color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-blue-500/15 text-blue-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}