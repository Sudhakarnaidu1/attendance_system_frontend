// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft, CircleCheck as CheckCircle2 } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '../../components/ui/button';
// import { Card } from '../../components/ui/card';
// import { Input } from '../../components/ui/input';
// import { Label } from '../../components/ui/label';
// import { Alert, AlertDescription } from '../../components/ui/alert';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
// import { CameraCapture } from '../../components/face/camera-capture';
// import { Header } from '../../components/layouts/header';
// import { toast } from 'sonner';

// type RegistrationStep = 'details' | 'face' | 'success';

// export default function RegisterPage() {
//   const router = useRouter();
//   const [step, setStep] = useState<RegistrationStep>('details');
//   const [isLoading, setIsLoading] = useState(false);
//   const [registeredUser, setRegisteredUser] = useState<any>(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     employeeId: '',
//     email: '',
//     department: '',
//     userType: 'user' as 'admin' | 'user',
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUserTypeChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, userType: value as 'admin' | 'user' }));
//   };

//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       toast.error('Name is required');
//       return false;
//     }
//     if (!formData.employeeId.trim()) {
//       toast.error('Employee ID is required');
//       return false;
//     }
//     if (!formData.email.trim() || !formData.email.includes('@')) {
//       toast.error('Valid email is required');
//       return false;
//     }
//     return true;
//   };

//   const handleNextStep = () => {
//     if (!validateForm()) return;
//     setStep('face');
//   };

//   /* =========================
//      ONLY CHANGE: DJANGO API
//   ========================= */
//   const handleFaceCapture = async (imageBase64: string) => {
//     setIsLoading(true);

//     try {
//       const res = await fetch('http://localhost:8000/api/register-face/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           employee_id: formData.employeeId,
//           email: formData.email,
//           department: formData.department,
//           user_type: formData.userType,
//           image: imageBase64,
//         }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         toast.error(data.message || 'Failed to register user');
//         setIsLoading(false);
//         return;
//       }

//       setRegisteredUser(data.user);
//       setStep('success');
//       toast.success('Face registered successfully!');

//     } catch (err) {
//       toast.error('Failed to save face data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
//         <div className="max-w-2xl mx-auto">
//           {step === 'details' && (
//             <Card className="shadow-lg border-slate-200">
//               <div className="p-8">
//                 <div className="mb-8">
//                   <h1 className="text-3xl font-bold text-slate-900">Register New User</h1>
//                   <p className="text-slate-600 mt-2">Create an account and register your face</p>
//                 </div>

//                 <div className="space-y-6">
//                   {/* UI UNCHANGED */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-sm font-semibold text-slate-700">
//                         Full Name *
//                       </Label>
//                       <Input
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="John Doe"
//                         className="mt-2 border-slate-300"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="employeeId" className="text-sm font-semibold text-slate-700">
//                         Employee ID *
//                       </Label>
//                       <Input
//                         id="employeeId"
//                         name="employeeId"
//                         value={formData.employeeId}
//                         onChange={handleInputChange}
//                         placeholder="EMP001"
//                         className="mt-2 border-slate-300"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
//                       Email *
//                      </Label>
//                      <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="john@example.com"
//                       className="mt-2 border-slate-300"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="department" className="text-sm font-semibold text-slate-700">
//                         Department
//                       </Label>
//                       <Input
//                         id="department"
//                         name="department"
//                         value={formData.department}
//                         onChange={handleInputChange}
//                         placeholder="Engineering"
//                         className="mt-2 border-slate-300"
//                       />
//                     </div>

//                   <div>
//                       <Label htmlFor="userType" className="text-sm font-semibold text-slate-700">
//                         User Type *
//                       </Label>
//                       <Select value={formData.userType} onValueChange={handleUserTypeChange}>
//                         <SelectTrigger className="mt-2 border-slate-300">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="user">User</SelectItem>
//                           <SelectItem value="admin">Admin</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <Alert>
//                     <AlertDescription className="text-sm text-slate-700">
//                       You will be asked to capture your face in the next step for biometric authentication.
//                     </AlertDescription>
//                   </Alert>

//                   <div className="flex gap-3 pt-4">
//                     <Link href="/" className="flex-1">
//                       <Button variant="outline" className="w-full border-slate-300">
//                         <ArrowLeft className="w-4 h-4 mr-2" />
//                         Back
//                       </Button>
//                     </Link>
//                     <Button
//                       onClick={handleNextStep}
//                       disabled={isLoading}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700"
//                     >
//                       Next: Face Capture
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {step === 'face' && (
//             <Card className="shadow-lg border-slate-200">
//               <div className="p-8">
//                 <div className="mb-8">
//                    <h1 className="text-3xl font-bold text-slate-900">Register Your Face</h1>
//                    <p className="text-slate-600 mt-2">This biometric data will be used to authenticate you</p>
//                 </div>
//                 <CameraCapture
//                   onCapture={handleFaceCapture}
//                   isLoading={isLoading}
//                   title="Face Registration"
//                   description="Position your face clearly in the center of the frame. Good lighting is important."
//                 />
//                 <div className="flex gap-3 mt-8">
//                    <Button
//                     onClick={() => setStep('details')}
//                     disabled={isLoading}
//                     variant="outline"
//                     className="flex-1 border-slate-300"
//                   >
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Back
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {step === 'success' && registeredUser && (
//             <Card className="shadow-lg border-green-200 bg-green-50">
//               <div className="p-8 text-center">
//                 <CheckCircle2 className="mx-auto text-green-600 w-12 h-12" />
//                 <h1 className="text-2xl font-bold mt-4">
//                   Registration Successful!
//                 </h1>
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
import { ArrowLeft, ArrowRight, Camera, CheckCircle, LogIn } from 'lucide-react';
import Link from 'next/link';
import { CameraCapture } from '../../components/face/camera-capture';
import { toast } from '../../hooks/use-toast';
import { Header } from '@/components/layouts/header';

type RegistrationStep = 'details' | 'face' | 'success';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    department: 'BCA' as 'BBA' | 'BCA' | 'B.Com',
    userType: 'user' as 'admin' | 'user',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { toast({
      title:'Error',
      variant: 'destructive',
      description: 'Name is required'}); return false; }
    if (!formData.employeeId.trim()) { toast({description:'Employee ID is required', title:'Error', variant: 'destructive'}); return false; }
    if (!formData.email.trim() || !formData.email.includes('@')) { toast({description:'Valid email is required', title:'Error', variant:'destructive'}); return false; }
    if (!formData.password || formData.password.length < 6) { toast({description: 'Password must be at least 6 characters', variant:'destructive', title: 'Error'}); return false; }
    return true;
  };

  const handleNextStep = () => {
    console.log('form data', formData)
    if (!validateForm()) return;
    setStep('face');
  };

  // const handleFaceCapture = async (imageBase64: string) => {
  //   setIsLoading(true);

  //   try {
  //     const res = await fetch('http://127.0.0.1:8000/api/register-face/', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         employee_id: formData.employeeId,
  //         email: formData.email,
  //         password: formData.password,
  //         department: formData.department,
  //         user_type: formData.userType,
  //         image: imageBase64,
  //       }),
  //     });

  //     const data = await res.json();
  //     console.log("API response:", data);
  //     toast({description: 'Received response from server', title: 'Success'});

  //     if (!data.success) {
  //       toast({description: data.message || 'Failed to register', title:'Error', variant: 'destructive'});
  //       setIsLoading(false);
  //       return;
  //     }

  //     setRegisteredUser(data.user);
  //     setStep('success');
  //     toast({description: 'Registration successful!', title:'Success'});
  //   } catch (err) {
  //     toast({description:'Failed to save data', title:'Error', variant:'destructive'});
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFaceCapture = async (imageBase64: string) => {
  setIsLoading(true);

  try {
    const res = await fetch('http://127.0.0.1:8000/api/register-face/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        employee_id: formData.employeeId,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        user_type: formData.userType,
        image: imageBase64,
      }),
    });

    const data = await res.json();

    // ✅ Check success flag first — no premature success toast
    if (!data.success) {
      toast({
        title: 'Registration Failed',
        description: data.message || 'Something went wrong.',
        variant: 'destructive',
      });
      return; // stay on face step so user can retry
    }

    // ✅ Only toast success when it actually succeeded
    setRegisteredUser(data.user);
    setStep('success');
    toast({ title: 'Success', description: 'Registration successful!' });

  } catch (err) {
    // ✅ Network/parse error — distinguish from API error
    toast({
      title: 'Network Error',
      description: 'Could not reach the server. Check your connection.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
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
            <span className="text-lg font-bold tracking-tight">MarkYourAttendance</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
        </div>
      </header>
      {/* <Header /> */}

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* ─── Step Indicator ─── */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {['Details', 'Face Capture', 'Done'].map((label, i) => {
              const stepIndex = step === 'details' ? 0 : step === 'face' ? 1 : 2;
              const active = stepIndex === i;
              const done = stepIndex > i;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : active
                        ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/20'
                        : 'bg-white/10 text-slate-500'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-500'}`}>
                    {label}
                  </span>
                  {i < 2 && <div className="w-8 h-px bg-white/15 mx-1" />}
                </div>
              );
            })}
          </div>

          {/* ─── Details Step ─── */}
          {step === 'details' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl shadow-black/40">
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold tracking-tight">Create Account</h1>
                <p className="text-slate-400 text-sm mt-1.5">Fill in your details to get started</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Student ID *
                    </label>
                    <input
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      placeholder="Enter your student id"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Department
                    </label>
                    {/* <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Engineering"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-sm"
                    /> */}
                    <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/15 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm"
                    >
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="B.Com">B.Com</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      User Type *
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0f1e] border border-white/15 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm"
                    >
                      <option value="user">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-sm text-cyan-300">
                  📸 Next: capture your face for biometric attendance marking
                </div>

                <div className="flex gap-3 pt-2">
                  <Link href="/" className="flex-1">
                    <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:bg-white/10 font-semibold text-sm transition-all flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </Link>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    Next: Face Capture
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Face Capture Step ─── */}
          {step === 'face' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl shadow-black/40">
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold tracking-tight">Capture Your Face</h1>
                <p className="text-slate-400 text-sm mt-1.5">
                  This will be used to mark your attendance. Ensure good lighting.
                </p>
              </div>

              {/* Wrap CameraCapture with dark-mode styling context */}
              <div className="[&_h3]:text-white [&_p]:text-slate-400 [&_video]:rounded-xl [&_.border-slate-200]:border-white/15 [&_.bg-slate-900]:bg-black/70 [&_button]:rounded-xl">
                <CameraCapture
                  onCapture={handleFaceCapture}
                  isLoading={isLoading}
                  title="Face Registration"
                  description="Center your face and ensure good lighting"
                />
              </div>

              <button
                onClick={() => setStep('details')}
                disabled={isLoading}
                className="mt-5 w-full py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:bg-white/10 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </button>
            </div>
          )}

          {/* ─── Success Step ─── */}
          {step === 'success' && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-10 text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-emerald-400 mb-1">Registration Complete!</h1>
                <p className="text-slate-400 text-sm">Your face data has been saved successfully</p>
              </div>
              {registeredUser && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name</span>
                    <span className="font-semibold">{registeredUser.name}</span>
                  </div>
                  <div className="border-t border-white/10" />
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student ID</span>
                    <span className="font-semibold">{registeredUser.employee_id}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/login')}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm transition-all"
                >
                  Mark Attendance
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}