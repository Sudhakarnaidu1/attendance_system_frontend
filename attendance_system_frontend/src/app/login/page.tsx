// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { CircleAlert as AlertCircle, Lock, Search } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '../../components/ui/button';
// import { Card } from '../../components/ui/card';
// import { Input } from '../../components/ui/input';
// import { Label } from '../../components/ui/label';
// import { Alert, AlertDescription } from '../../components/ui/alert';
// import { FaceDetector } from '../../components/face/face-detector';
// import { Header } from '../../components/layouts/header';
// import { toast } from 'sonner';

// type LoginStep = 'search' | 'verify' | 'success';

// type User = {
//   id: string;
//   name: string;
//   employee_id: string;
// };

// export default function LoginPage() {
//   const router = useRouter();

//   const [step, setStep] = useState<LoginStep>('search');
//   const [isLoading, setIsLoading] = useState(false);
//   const [employeeId, setEmployeeId] = useState('');
//   const [foundUser, setFoundUser] = useState<User | null>(null);
//   const [loginTime] = useState(new Date());

//   /* =========================
//      STEP 1: FIND USER (DJANGO)
//   ========================= */
//   const handleSearchUser = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!employeeId.trim()) {
//       toast.error('Please enter Employee ID');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch(`http://localhost:8000/api/users/${employeeId}`);
//       const data = await res.json();

//       if (!data || !data.id) {
//         toast.error('Employee ID not found. Please register first.');
//         setIsLoading(false);
//         return;
//       }

//       setFoundUser(data);
//       sessionStorage.setItem('currentEmployeeId', data.employee_id);
//       setStep('verify');

//     } catch (err) {
//       toast.error('Error searching for user');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* =========================
//      STEP 2: FACE VERIFY (DJANGO)
//   ========================= */
//   const handleFaceCapture = async (imageBase64: string) => {
//     if (!foundUser) return;

//     setIsLoading(true);

//     try {
//       const res = await fetch('http://localhost:8000/api/face-login/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           employee_id: foundUser.employee_id,
//           image: imageBase64,
//         }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         toast.error('Face verification failed. Please try again.');
//         setIsLoading(false);
//         return;
//       }

//       setStep('success');
//       toast.success(`Welcome ${foundUser.name}! Login successful.`);

//       setTimeout(() => {
//         router.push('/dashboard');
//       }, 2000);

//     } catch (err) {
//       toast.error('Failed to process login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setStep('search');
//     setEmployeeId('');
//     setFoundUser(null);
//   };

//   return (
//     <>
//       <Header />
//       <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
//         <div className="max-w-2xl mx-auto">

//           {step === 'search' && (
//             <Card className="shadow-lg border-slate-200">
//               <div className="p-8">
//                 <div className="mb-8">
//                   <h1 className="text-3xl font-bold text-slate-900">Face Login</h1>
//                   <p className="text-slate-600 mt-2">Sign in using your face recognition</p>
//                 </div>

//                 <form onSubmit={handleSearchUser} className="space-y-6">
//                   <div>
//                     <Label className="text-sm font-semibold text-slate-700">
//                       Employee ID *
//                     </Label>
//                     <Input
//                       value={employeeId}
//                       onChange={(e) => setEmployeeId(e.target.value)}
//                       placeholder="Enter your Employee ID"
//                       className="mt-2 border-slate-300 text-base"
//                       disabled={isLoading}
//                     />
//                     <p className="text-xs text-slate-500 mt-2">
//                       Enter your Employee ID to proceed with face verification
//                     </p>
//                   </div>

//                   <Alert>
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription className="text-sm text-slate-700">
//                       Make sure your face is clearly visible and well-lit during verification
//                     </AlertDescription>
//                   </Alert>

//                   <Button
//                     type="submit"
//                     disabled={isLoading || !employeeId.trim()}
//                     className="w-full bg-blue-600 hover:bg-blue-700"
//                   >
//                     <Search className="w-4 h-4 mr-2" />
//                     {isLoading ? 'Searching...' : 'Next: Face Verification'}
//                   </Button>
//                 </form>

//                 <div className="mt-6 pt-6 border-t border-slate-200 text-center">
//                   <p className="text-slate-600 text-sm">
//                     Don't have an account?{' '}
//                     <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
//                       Register here
//                     </Link>
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {step === 'verify' && foundUser && (
//             <Card className="shadow-lg border-slate-200">
//               <div className="p-8">
//                 <div className="mb-8">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                       <Lock className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <div>
//                       <h1 className="text-2xl font-bold text-slate-900">Verify Your Face</h1>
//                       <p className="text-slate-600 text-sm">Welcome back, {foundUser.name}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <FaceDetector
//                   onCapture={handleFaceCapture}   // 🔥 ONLY CHANGE HERE
//                   isLoading={isLoading}
//                 />

//                 <Button
//                   onClick={handleReset}
//                   variant="outline"
//                   disabled={isLoading}
//                   className="w-full mt-6 border-slate-300"
//                 >
//                   Try Different User
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {step === 'success' && foundUser && (
//             <Card className="shadow-lg border-green-200 bg-green-50">
//               <div className="p-8">
//                 <div className="text-center space-y-6">

//                   <div>
//                     <h1 className="text-3xl font-bold text-green-900">Login Successful!</h1>
//                     <p className="text-green-700 mt-2">Your attendance has been recorded</p>
//                   </div>

//                   <div className="bg-white rounded-lg p-6 text-left space-y-3 border border-green-200">
//                     <div className="flex justify-between">
//                       <span>Name:</span>
//                       <span>{foundUser.name}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Employee ID:</span>
//                       <span>{foundUser.employee_id}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Login Time:</span>
//                       <span>{loginTime.toLocaleTimeString()}</span>
//                     </div>
//                   </div>

//                   <Button
//                     onClick={() => router.push('/dashboard')}
//                     className="w-full bg-blue-600 hover:bg-blue-700"
//                   >
//                     Go to Dashboard
//                   </Button>

//                 </div>
//               </div>
//             </Card>
//           )}

//         </div>
//       </main>
//     </>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Camera, ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!formData.email.trim() || !formData.password.trim()) {
    //   toast.error('Please fill in all fields');
    //   return;
    // }

    // setIsLoading(true);

    // try {
    //   const res = await fetch('http://localhost:8000/api/login/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       email: formData.email,
    //       password: formData.password,
    //     }),
    //   });

    //   const data = await res.json();

    //   if (!data.success) {
    //     toast.error(data.message || 'Invalid credentials');
    //     setIsLoading(false);
    //     return;
    //   }

    //   // Store session info
      // sessionStorage.setItem('currentEmployeeId', data.user.employee_id);
      // sessionStorage.setItem('userType', data.user.user_type);
      sessionStorage.setItem('currentEmployeeId', 'EMP12345');
      sessionStorage.setItem('userType', 'user');

    //   toast.success(`Welcome back, ${data.user.name}!`);
      router.push('/dashboard');
    // } catch (err) {
    //   toast.error('Login failed. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans flex flex-col">
      {/* ─── Header ─── */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FaceAttend</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Register
          </Link>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4">
              Employee Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Sign In</h1>
            <p className="text-slate-400 mt-2 text-sm">Access your attendance records and dashboard</p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-sm"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Register here
            </Link>
          </p>
          <p className="text-center text-sm text-slate-600 mt-3">
            Want to mark attendance?{' '}
            <Link href="/attendance" className="text-slate-400 hover:text-slate-300 font-medium transition-colors">
              Go to Attendance →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}