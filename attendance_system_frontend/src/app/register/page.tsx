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
    if (!formData.employeeId.trim()) { toast({description:'Student ID is required', title:'Error', variant: 'destructive'}); return false; }
    if (!formData.email.trim() || !formData.email.includes('@')) { toast({description:'Valid email is required', title:'Error', variant:'destructive'}); return false; }
    if (!formData.password || formData.password.length < 6) { toast({description: 'Password must be at least 6 characters', variant:'destructive', title: 'Error'}); return false; }
    return true;
  };

  const handleNextStep = () => {
    console.log('form data', formData)
    if (!validateForm()) return;
    setStep('face');
  };

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