// 'use client';

// import Link from 'next/link';
// import { ArrowRight, Shield, Zap, Eye } from 'lucide-react';
// import { Button } from '../components/ui/button';
// import { Card } from '../components/ui/card';
// import { Header } from '../components/layouts/header';

// export default function Home() {
//   return (
//     <>
//       <Header />
//       <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="text-center space-y-6 mb-16">
//             <div className="inline-block px-4 py-2 bg-blue-100 rounded-full">
//               <p className="text-sm font-semibold text-blue-700">Biometric Attendance System</p>
//             </div>

//             <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
//               Secure Face Recognition
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
//                 Attendance Tracking
//               </span>
//             </h1>

//             <p className="text-xl text-slate-600 max-w-2xl mx-auto">
//               Advanced facial biometrics combined with secure attendance logging. Mark your presence with
//               just your face.
//             </p>

//             <div className="flex gap-4 justify-center pt-4">
//               <Link href="/register">
//                 <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
//                   Register Now
//                   <ArrowRight className="w-5 h-5 ml-2" />
//                 </Button>
//               </Link>
//               <Link href="/login">
//                 <Button className="border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 px-8 py-6 text-lg">
//                   Login
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
//             <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
//               <div className="p-8 space-y-4">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Eye className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900">Face Recognition</h3>
//                 <p className="text-slate-600 leading-relaxed">
//                   Advanced AI-powered facial recognition ensures accurate and secure identification for every
//                   attendance marking.
//                 </p>
//               </div>
//             </Card>

//             <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
//               <div className="p-8 space-y-4">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Shield className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900">Secure & Private</h3>
//                 <p className="text-slate-600 leading-relaxed">
//                   Your biometric data is encrypted and stored securely. Bank-level security protocols protect
//                   all information.
//                 </p>
//               </div>
//             </Card>

//             <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
//               <div className="p-8 space-y-4">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Zap className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900">Instant Verification</h3>
//                 <p className="text-slate-600 leading-relaxed">
//                   Real-time face detection and matching with instant feedback. Mark attendance in seconds, no
//                   hassle.
//                 </p>
//               </div>
//             </Card>
//           </div>

//           <div className="mt-20 bg-white rounded-lg shadow-lg border border-slate-200 p-8 md:p-12">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//               <div className="space-y-6">
//                 <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
//                 <div className="space-y-4">
//                   <div className="flex gap-4">
//                     <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
//                       1
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-slate-900">Register Your Face</h4>
//                       <p className="text-slate-600 text-sm">
//                         Complete your profile and capture your face in good lighting
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-4">
//                     <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
//                       2
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-slate-900">Position Your Face</h4>
//                       <p className="text-slate-600 text-sm">
//                         Look at the camera during login for face recognition
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-4">
//                     <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
//                       3
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-slate-900">Instant Verification</h4>
//                       <p className="text-slate-600 text-sm">
//                         Your attendance is automatically logged and recorded
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-8 border border-blue-200">
//                 <div className="aspect-video bg-blue-200 rounded-lg flex items-center justify-center">
//                   <p className="text-blue-700 font-medium">Real-time Face Detection Demo</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-20 text-center space-y-6">
//             <h2 className="text-3xl font-bold text-slate-900">Ready to Get Started?</h2>
//             <p className="text-lg text-slate-600 max-w-xl mx-auto">
//               Join thousands of organizations using face recognition for attendance management
//             </p>
//             <Link href="/register">
//               <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
//                 Create Account
//                 <ArrowRight className="w-5 h-5 ml-2" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }




//---------------------------darlk theme ---------------------------
// 'use client';

// import Link from 'next/link';
// import { ArrowRight, Shield, Zap, Eye, Camera } from 'lucide-react';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
//       {/* ─── Header ─── */}
//       <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
//               <Camera className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-lg font-bold tracking-tight">FaceAttend</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
//               Login
//             </Link>
//             <Link
//               href="/register"
//               className="text-sm bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
//         {/* ─── Hero ─── */}
//         <div className="text-center space-y-6">
//           <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
//             <p className="text-sm font-semibold text-cyan-400">Biometric Attendance System</p>
//           </div>

//           <h1 className="text-5xl md:text-6xl font-bold leading-tight">
//             Secure Face Recognition
//             <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
//               Attendance Tracking
//             </span>
//           </h1>

//           <p className="text-lg text-slate-400 max-w-2xl mx-auto">
//             Advanced facial biometrics combined with secure attendance logging. Mark your presence with just your face.
//           </p>

//           <div className="flex gap-4 justify-center pt-4">
//             <Link
//               href="/attendance"
//               className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all shadow-lg shadow-cyan-500/25"
//             >
//               Mark Attendance
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//             <Link
//               href="/login"
//               className="flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all"
//             >
//               Login
//             </Link>
//           </div>
//         </div>

//         {/* ─── Feature Cards ─── */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             {
//               icon: Eye,
//               color: 'cyan',
//               title: 'Face Recognition',
//               desc: 'Advanced AI-powered facial recognition ensures accurate and secure identification for every attendance marking.',
//             },
//             {
//               icon: Shield,
//               color: 'blue',
//               title: 'Secure & Private',
//               desc: 'Your biometric data is encrypted and stored securely. Bank-level security protocols protect all information.',
//             },
//             {
//               icon: Zap,
//               color: 'violet',
//               title: 'Instant Verification',
//               desc: 'Real-time face detection and matching with instant feedback. Mark attendance in seconds, no hassle.',
//             },
//           ].map(({ icon: Icon, color, title, desc }) => (
//             <div
//               key={title}
//               className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4 hover:bg-white/8 transition-all"
//             >
//               <div
//                 className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//                   color === 'cyan'
//                     ? 'bg-cyan-500/15 text-cyan-400'
//                     : color === 'blue'
//                     ? 'bg-blue-500/15 text-blue-400'
//                     : 'bg-violet-500/15 text-violet-400'
//                 }`}
//               >
//                 <Icon className="w-6 h-6" />
//               </div>
//               <h3 className="text-xl font-bold">{title}</h3>
//               <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* ─── How It Works ─── */}
//         <div className="rounded-2xl border border-white/10 bg-white/5 p-10 md:p-14">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8">
//               <h2 className="text-3xl font-bold">How It Works</h2>
//               <div className="space-y-6">
//                 {[
//                   { step: '1', title: 'Register Your Face', desc: 'Complete your profile and capture your face in good lighting.' },
//                   { step: '2', title: 'Position Your Face', desc: 'Look at the camera during login for face recognition.' },
//                   { step: '3', title: 'Instant Verification', desc: 'Your attendance is automatically logged and recorded.' },
//                 ].map(({ step, title, desc }) => (
//                   <div key={step} className="flex gap-4">
//                     <div className="flex-shrink-0 w-9 h-9 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/25">
//                       {step}
//                     </div>
//                     <div>
//                       <h4 className="font-semibold">{title}</h4>
//                       <p className="text-slate-400 text-sm mt-0.5">{desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="rounded-xl border border-white/10 bg-white/5 p-8 flex items-center justify-center">
//               <div className="aspect-video w-full rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center gap-3">
//                 <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center">
//                   <Camera className="w-7 h-7 text-cyan-400" />
//                 </div>
//                 <p className="text-cyan-400 font-medium text-sm">Real-time Face Detection</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ─── CTA ─── */}
//         <div className="text-center space-y-6">
//           <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
//           <p className="text-slate-400 max-w-xl mx-auto">
//             Join thousands of organizations using face recognition for attendance management.
//           </p>
//           <Link
//             href="/register"
//             className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all shadow-lg shadow-cyan-500/25"
//           >
//             Create Account
//             <ArrowRight className="w-5 h-5" />
//           </Link>
//         </div>
//       </main>
//     </div>
//   );
// }


import AttendancePage from './attendance/page';

export default function Home() {
  return(
  <div>
    <AttendancePage />
  </div>);
}