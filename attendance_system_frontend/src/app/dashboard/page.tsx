// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Clock, Calendar, User, LogOut } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { Card } from '../../components/ui/card';
// import { Header } from '../../components/layouts/header';
// // import { supabase, User as DBUser, AttendanceLog } from '@/lib/supabase';
// import { toast } from 'sonner';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [currentUser, setCurrentUser] = useState<DBUser | null>(null);
//   const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [allUsers, setAllUsers] = useState<DBUser[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//     //   try {
//     //     setIsLoading(true);

//     //     const employeeId = sessionStorage.getItem('currentEmployeeId');

//     //     if (!employeeId) {
//     //       router.push('/login');
//     //       return;
//     //     }

//         // const { data: userData, error: userError } = await supabase
//         //   .from('users')
//         //   .select('*')
//         //   .eq('employee_id', employeeId)
//         //   .single();

//     //     if (userError || !userData) {
//     //       toast.error('User not found');
//     //       router.push('/login');
//     //       return;
//     //     }

//     //     setCurrentUser(userData);
//     //     setSelectedUserId(userData.id);

//     //     if (userData.user_type === 'admin') {
//     //       const { data: usersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
//     //       setAllUsers(usersData || []);
//     //     }

//     //     await loadAttendanceLogs(userData.id);
//     //   } catch (err) {
//     //     toast.error('Failed to load dashboard');
//     //   } finally {
//     //     setIsLoading(false);
//     //   }
//     console.log('hi')
//     };

//     loadData();
//   }, [router]);

//   const loadAttendanceLogs = async (userId: string) => {
//     // try {
//     //   const { data, error } = await supabase
//     //     .from('attendance_logs')
//     //     .select('*')
//     //     .eq('user_id', userId)
//     //     .order('login_time', { ascending: false })
//     //     .limit(50);

//     //   if (!error && data) {
//     //     setAttendanceLogs(data);
//     //   }
//     // } catch (err) {
//     //   console.error('Failed to load attendance logs:', err);
//     // }
//     console.log('yes')
//   };

//   const handleLogout = async () => {
//     // try {
//     //   if (currentUser) {
//     //     const lastLog = attendanceLogs.find((log) => log.status === 'logged_in');
//     //     if (lastLog) {
//     //       await supabase
//     //         .from('attendance_logs')
//     //         .update({
//     //           logout_time: new Date().toISOString(),
//     //           status: 'logged_out',
//     //         })
//     //         .eq('id', lastLog.id);
//     //     }
//     //   }

//     //   sessionStorage.removeItem('currentEmployeeId');
//     //   router.push('/login');
//     //   toast.success('Logged out successfully');
//     // } catch (err) {
//     //   toast.error('Failed to logout');
//     // }
//     console.log('yes')
//   };

//   const handleUserChange = async (userId: string) => {
//     setSelectedUserId(userId);
//     await loadAttendanceLogs(userId);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     });
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true,
//     });
//   };

//   const getTodaysAttendance = () => {
//     const today = new Date().toDateString();
//     return attendanceLogs.filter((log) => new Date(log.login_time).toDateString() === today);
//   };

//   const getTotalWorkingHours = () => {
//     const today = new Date().toDateString();
//     const todaysLogs = attendanceLogs.filter((log) => new Date(log.login_time).toDateString() === today);

//     let totalMinutes = 0;
//     todaysLogs.forEach((log) => {
//       if (log.logout_time) {
//         const loginTime = new Date(log.login_time).getTime();
//         const logoutTime = new Date(log.logout_time).getTime();
//         totalMinutes += (logoutTime - loginTime) / (1000 * 60);
//       }
//     });

//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = Math.floor(totalMinutes % 60);
//     return `${hours}h ${minutes}m`;
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Header userName={currentUser?.name} onLogout={handleLogout} />
//         <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center py-12">
//               <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
//                 <Clock className="w-6 h-6 text-blue-600 animate-spin" />
//               </div>
//               <p className="text-slate-600">Loading dashboard...</p>
//             </div>
//           </div>
//         </main>
//       </>
//     );
//   }

//   if (!currentUser) {
//     return null;
//   }

//   return (
//     <>
//       <Header userName={currentUser.name} onLogout={handleLogout} />
//       <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
//         <div className="max-w-6xl mx-auto space-y-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="shadow-lg border-slate-200 bg-white">
//               <div className="p-6 space-y-2">
//                 <div className="flex items-center gap-2 text-slate-600">
//                   <User className="w-4 h-4" />
//                   <span className="text-sm font-medium">Name</span>
//                 </div>
//                 <p className="text-2xl font-bold text-slate-900">{currentUser.name}</p>
//               </div>
//             </Card>

//             <Card className="shadow-lg border-slate-200 bg-white">
//               <div className="p-6 space-y-2">
//                 <div className="flex items-center gap-2 text-slate-600">
//                   <Calendar className="w-4 h-4" />
//                   <span className="text-sm font-medium">Employee ID</span>
//                 </div>
//                 <p className="text-2xl font-bold text-slate-900">{currentUser.employee_id}</p>
//               </div>
//             </Card>

//             <Card className="shadow-lg border-slate-200 bg-white">
//               <div className="p-6 space-y-2">
//                 <div className="flex items-center gap-2 text-slate-600">
//                   <Clock className="w-4 h-4" />
//                   <span className="text-sm font-medium">Today's Hours</span>
//                 </div>
//                 <p className="text-2xl font-bold text-slate-900">{getTotalWorkingHours()}</p>
//               </div>
//             </Card>
//           </div>

//           {currentUser.user_type === 'admin' && allUsers.length > 0 && (
//             <Card className="shadow-lg border-slate-200">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-slate-900 mb-4">View Employee Attendance</h2>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                   {allUsers.map((user) => (
//                     <Button
//                       key={user.id}
//                       onClick={() => handleUserChange(user.id)}
//                       variant={selectedUserId === user.id ? 'default' : 'outline'}
//                       className={`text-left h-auto p-3 ${
//                         selectedUserId === user.id
//                           ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                           : 'border-slate-300'
//                       }`}
//                     >
//                       <div>
//                         <p className="font-medium text-sm">{user.name}</p>
//                         <p className="text-xs opacity-75">{user.employee_id}</p>
//                       </div>
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             </Card>
//           )}

//           <Card className="shadow-lg border-slate-200">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold text-slate-900 mb-6">Attendance History</h2>

//               {getTodaysAttendance().length > 0 && (
//                 <div className="mb-8">
//                   <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Today</h3>
//                   <div className="space-y-2">
//                     {getTodaysAttendance().map((log) => (
//                       <div
//                         key={log.id}
//                         className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
//                       >
//                         <div className="space-y-1">
//                           <p className="font-medium text-slate-900">
//                             {log.status === 'logged_in' ? '✓ Login' : '✗ Logout'}
//                           </p>
//                           <p className="text-sm text-slate-600">{formatTime(log.login_time)}</p>
//                         </div>
//                         {log.logout_time && (
//                           <div className="text-right">
//                             <p className="text-sm text-slate-600">Logged out</p>
//                             <p className="font-medium text-slate-900">{formatTime(log.logout_time)}</p>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">All Records</h3>
//                 {attendanceLogs.length > 0 ? (
//                   <div className="space-y-2 max-h-96 overflow-y-auto">
//                     {attendanceLogs.map((log) => (
//                       <div
//                         key={log.id}
//                         className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
//                       >
//                         <div className="space-y-1">
//                           <p className="font-medium text-slate-900">
//                             {log.status === 'logged_in' ? 'Login' : 'Logout'}
//                           </p>
//                           <p className="text-sm text-slate-500">{formatDate(log.login_time)}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium text-slate-900">{formatTime(log.login_time)}</p>
//                           {log.logout_time && (
//                             <p className="text-sm text-slate-500">{formatTime(log.logout_time)}</p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
//                     <p className="text-slate-600">No attendance records found</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Card>
//         </div>
//       </main>
//     </>
//   );
// }











//working code----------------------------------------------------------------------------------

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Clock, Calendar, User } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { Card } from '../../components/ui/card';
// import { Header } from '../../components/layouts/header';
// import { toast } from 'sonner';

// /* =========================
//    TYPES (Replace Supabase)
// ========================= */
// type UserType = {
//   id: string;
//   name: string;
//   employee_id: string;
//   user_type: 'admin' | 'employee';
// };

// type AttendanceLog = {
//   id: string;
//   user_id: string;
//   login_time: string;
//   logout_time?: string;
//   status: 'logged_in' | 'logged_out';
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   const [currentUser, setCurrentUser] = useState<UserType | null>(null);
//   const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [allUsers, setAllUsers] = useState<UserType[]>([]);

//   /* =========================
//      LOAD INITIAL DATA
//   ========================= */
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsLoading(true);

//         const employeeId = sessionStorage.getItem('currentEmployeeId');

//         if (!employeeId) {
//           router.push('/login');
//           return;
//         }

//         // 🔥 Fetch user from Django
//         const userRes = await fetch(`http://localhost:8000/api/users/${employeeId}`);
//         const userData = await userRes.json();

//         if (!userData) {
//           toast.error('User not found');
//           router.push('/login');
//           return;
//         }

//         setCurrentUser(userData);
//         setSelectedUserId(userData.id);

//         // 🔥 If admin → fetch all users
//         if (userData.user_type === 'admin') {
//           const usersRes = await fetch('http://localhost:8000/api/users/');
//           const usersData = await usersRes.json();
//           setAllUsers(usersData || []);
//         }

//         await loadAttendanceLogs(userData.id);

//       } catch (err) {
//         toast.error('Failed to load dashboard');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, [router]);

//   /* =========================
//      LOAD ATTENDANCE
//   ========================= */
//   const loadAttendanceLogs = async (userId: string) => {
//     try {
//       const res = await fetch(`http://localhost:8000/api/attendance/${userId}`);
//       const data = await res.json();
//       setAttendanceLogs(data || []);
//     } catch (err) {
//       console.error('Failed to load attendance logs:', err);
//     }
//   };

//   /* =========================
//      LOGOUT
//   ========================= */
//   const handleLogout = async () => {
//     try {
//       sessionStorage.removeItem('currentEmployeeId');
//       router.push('/login');
//       toast.success('Logged out successfully');
//     } catch (err) {
//       toast.error('Failed to logout');
//     }
//   };

//   /* =========================
//      ADMIN USER SWITCH
//   ========================= */
//   const handleUserChange = async (userId: string) => {
//     setSelectedUserId(userId);
//     await loadAttendanceLogs(userId);
//   };

//   /* =========================
//      HELPERS
//   ========================= */
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     });
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true,
//     });
//   };

//   const getTodaysAttendance = () => {
//     const today = new Date().toDateString();
//     return attendanceLogs.filter(
//       (log) => new Date(log.login_time).toDateString() === today
//     );
//   };

//   const getTotalWorkingHours = () => {
//     const today = new Date().toDateString();
//     const todaysLogs = attendanceLogs.filter(
//       (log) => new Date(log.login_time).toDateString() === today
//     );

//     let totalMinutes = 0;

//     todaysLogs.forEach((log) => {
//       if (log.logout_time) {
//         const loginTime = new Date(log.login_time).getTime();
//         const logoutTime = new Date(log.logout_time).getTime();
//         totalMinutes += (logoutTime - loginTime) / (1000 * 60);
//       }
//     });

//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = Math.floor(totalMinutes % 60);

//     return `${hours}h ${minutes}m`;
//   };

//   /* =========================
//      LOADING STATE
//   ========================= */
//   if (isLoading) {
//     return (
//       <>
//         <Header userName={currentUser?.name} onLogout={handleLogout} />
//         <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
//           <div className="max-w-6xl mx-auto text-center py-12">
//             <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
//               <Clock className="w-6 h-6 text-blue-600 animate-spin" />
//             </div>
//             <p className="text-slate-600">Loading dashboard...</p>
//           </div>
//         </main>
//       </>
//     );
//   }

//   if (!currentUser) return null;

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <>
//       <Header userName={currentUser.name} onLogout={handleLogout} />

//       <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
//         <div className="max-w-6xl mx-auto space-y-8">

//           {/* Top Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="shadow-lg border-slate-200 bg-white p-6">
//               <div className="flex items-center gap-2 text-slate-600">
//                 <User className="w-4 h-4" />
//                 <span className="text-sm font-medium">Name</span>
//               </div>
//               <p className="text-2xl font-bold text-slate-900">
//                 {currentUser.name}
//               </p>
//             </Card>

//             <Card className="shadow-lg border-slate-200 bg-white p-6">
//               <div className="flex items-center gap-2 text-slate-600">
//                 <Calendar className="w-4 h-4" />
//                 <span className="text-sm font-medium">Employee ID</span>
//               </div>
//               <p className="text-2xl font-bold text-slate-900">
//                 {currentUser.employee_id}
//               </p>
//             </Card>

//             <Card className="shadow-lg border-slate-200 bg-white p-6">
//               <div className="flex items-center gap-2 text-slate-600">
//                 <Clock className="w-4 h-4" />
//                 <span className="text-sm font-medium">Today's Hours</span>
//               </div>
//               <p className="text-2xl font-bold text-slate-900">
//                 {getTotalWorkingHours()}
//               </p>
//             </Card>
//           </div>

//           {/* Admin Users */}
//           {currentUser.user_type === 'admin' && allUsers.length > 0 && (
//             <Card className="shadow-lg border-slate-200 p-6">
//               <h2 className="text-lg font-semibold mb-4">
//                 View Employee Attendance
//               </h2>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                 {allUsers.map((user) => (
//                   <Button
//                     key={user.id}
//                     onClick={() => handleUserChange(user.id)}
//                     variant={selectedUserId === user.id ? 'default' : 'outline'}
//                   >
//                     <div>
//                       <p className="font-medium text-sm">{user.name}</p>
//                       <p className="text-xs opacity-75">
//                         {user.employee_id}
//                       </p>
//                     </div>
//                   </Button>
//                 ))}
//               </div>
//             </Card>
//           )}

//           {/* Attendance */}
//           <Card className="shadow-lg border-slate-200 p-6">
//             <h2 className="text-lg font-semibold mb-6">
//               Attendance History
//             </h2>

//             {attendanceLogs.length === 0 ? (
//               <p className="text-center text-slate-600">
//                 No attendance records found
//               </p>
//             ) : (
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {attendanceLogs.map((log) => (
//                   <div
//                     key={log.id}
//                     className="flex justify-between p-4 bg-slate-50 rounded-lg"
//                   >
//                     <div>
//                       <p className="font-medium">
//                         {log.status === 'logged_in' ? 'Login' : 'Logout'}
//                       </p>
//                       <p className="text-sm text-slate-500">
//                         {formatDate(log.login_time)}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p>{formatTime(log.login_time)}</p>
//                       {log.logout_time && (
//                         <p className="text-sm text-slate-500">
//                           {formatTime(log.logout_time)}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>

//         </div>
//       </main>
//     </>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Clock,
//   Calendar,
//   User,
//   LogOut,
//   Camera,
//   ChevronRight,
//   Users,
//   CheckCircle,
//   XCircle,
//   Search,
//   BarChart3,
// } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from '../../hooks/use-toast';
// import { Header } from '@/components/layouts/header';

// type UserType = {
//   id: string;
//   name: string;
//   employee_id: string;
//   email: string;
//   department: string;
//   user_type: 'admin' | 'user';
// };

// type AttendanceLog = {
//   id: string;
//   user_id: string;
//   login_time: string;
//   logout_time?: string;
//   status: 'present' | 'absent' | 'logged_in' | 'logged_out';
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   const [currentUser, setCurrentUser] = useState<UserType | null>(null);
//   const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [allUsers, setAllUsers] = useState<UserType[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
//   const [allAttendanceLogs, setAllAttendanceLogs] = useState<AttendanceLog[]>([]);

//   /* ── Load Data ── */
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsLoading(true);
//         const employeeId = sessionStorage.getItem('currentEmployeeId');

//         if (!employeeId) {
//           router.push('/login');
//           return;
//         }

//         const userRes = await fetch(`http://127.0.0.1:8000/api/users/${employeeId}/`);
//         const userData = await userRes.json();

//         if (!userData) {
//           toast({
//             title: 'Error',
//             description: 'User not found',
//             variant: 'destructive'
//           });
//           router.push('/login');
//           return;
//         }

//         setCurrentUser(userData);
//         setSelectedUserId(userData.employee_id);

//         if (userData.user_type === 'admin') {
//           const usersRes = await fetch('http://localhost:8000/api/users/');
//           const usersData = await usersRes.json();
//           setAllUsers(usersData || []);

//           // ✅ NEW: fetch all logs
//           const logsRes = await fetch('http://localhost:8000/api/attendance/');
//           const logsData = await logsRes.json();
//           setAllAttendanceLogs(logsData || []);
//         }

        

//         await loadAttendanceLogs(userData.employee_id);
//       } catch (err) {
//         toast({title: 'Error',
//           description:'Failed to load dashboard',
//           variant: 'destructive'
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData()
//   }, [router]);

//   const loadAttendanceLogs = async (userId: string) => {
//     try {
//       const res = await fetch(`http://localhost:8000/api/attendance/${userId}/`);
//       const data = await res.json();
//       setAttendanceLogs(data || []);
//     } catch (err) {
//       console.error('Failed to load attendance logs:', err);
//     }
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem('currentEmployeeId');
//     sessionStorage.removeItem('userType');
//     router.push('/login');
//     toast({
//       title: "Success",
//       description: "Logged out successfully",
//     });
//   };

//   // const handleUserChange = async (user: UserType) => {
//   //   setSelectedUserId(user.id);
//   //   await loadAttendanceLogs(user.employee_id);
//   // };
//   const handleUserChange = (user: UserType) => {
//     setSelectedUserId(user.employee_id); // ✅ FIX
//     loadAttendanceLogs(user.employee_id); // no await (faster UI)
//   };

//   /* ── Helpers ── */
//   const formatDate = (d: string) =>
//     new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

//   const formatTime = (d: string) =>
//     new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

//   const getTodaysPresent = () => {
//     const today = new Date().toDateString();
//     return attendanceLogs.filter((l) => new Date(l.login_time).toDateString() === today).length;
//   };

//   const getTotalWorkingHours = () => {
//     const today = new Date().toDateString();
//     const logs = attendanceLogs.filter((l) => new Date(l.login_time).toDateString() === today);
//     let mins = 0;
//     logs.forEach((l) => {
//       if (l.logout_time) {
//         mins += (new Date(l.logout_time).getTime() - new Date(l.login_time).getTime()) / 60000;
//       }
//     });
//     return `${Math.floor(mins / 60)}h ${Math.floor(mins % 60)}m`;
//   };

//   const filteredUsers = allUsers.filter(
//     (u) =>
//       u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       u.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       u.department?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const selectedUserInfo = allUsers.find(
//     (u) => u.employee_id === selectedUserId
//   );
//   const getTotalStudents = () => {
//   return allUsers.length;
// };

// const getLoggedInUsers = () => {
//   const today = new Date().toDateString();

//   const latestStatus = new Map<string, AttendanceLog>();

//   allAttendanceLogs.forEach((log) => {
//     const logDate = new Date(log.login_time).toDateString();

//     if (logDate === today) {
//       const existing = latestStatus.get(log.user_id);

//       if (
//         !existing ||
//         new Date(log.login_time) > new Date(existing.login_time)
//       ) {
//         latestStatus.set(log.user_id, log);
//       }
//     }
//   });

//   return Array.from(latestStatus.values()).filter(
//     (log) => log.status === 'logged_in'
//   ).length;
// };

//   /* ── Loading ── */
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto" />
//           <p className="text-slate-400 text-sm">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!currentUser) return null;

//   const isAdmin = currentUser.user_type === 'admin';
//   const displayUser =
//   isAdmin && activeTab === 'all' && selectedUserInfo
//     ? selectedUserInfo
//     : currentUser;

//   return (
//     <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
//       {/* ─── Header ─── */}
//       <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
//               <Camera className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-lg font-bold tracking-tight">MarkYourAttendance</span>
//           </Link>

//           <div className="flex items-center gap-4">
//             <Link
//               href="/"
//               className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block"
//             >
//               Mark Attendance
//             </Link>
//             <div className="flex items-center gap-3">
//               <div className="text-right hidden sm:block">
//                 <p className="text-sm font-semibold">{currentUser.name}</p>
//                 <p className="text-xs text-slate-500 capitalize">
//                   {isAdmin ? '🛡 Admin' : '👤 Student'} · {currentUser.employee_id}
//                 </p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* <Header /> */}


//       <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
//         {/* ─── Stats Row ─── */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { icon: User, label: 'Name', value: displayUser.name.split(' ')[0], color: 'cyan' },
//             { icon: Calendar, label: 'Student ID', value: displayUser.employee_id, color: 'blue' },
//             { icon: Clock, label: "Today's Hours", value: getTotalWorkingHours(), color: 'violet' },
//             {
//               icon: CheckCircle,
//               label: "Today's Logs",
//               value: String(getTodaysPresent()),
//               color: 'emerald',
//             },
//           ].map(({ icon: Icon, label, value, color }) => (
//             <div
//               key={label}
//               className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3"
//             >
//               <div
//                 className={`w-9 h-9 rounded-lg flex items-center justify-center ${
//                   color === 'cyan'
//                     ? 'bg-cyan-500/15 text-cyan-400'
//                     : color === 'blue'
//                     ? 'bg-blue-500/15 text-blue-400'
//                     : color === 'violet'
//                     ? 'bg-violet-500/15 text-violet-400'
//                     : 'bg-emerald-500/15 text-emerald-400'
//                 }`}
//               >
//                 <Icon className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 mb-0.5">{label}</p>
//                 <p className="text-xl font-bold truncate">{value}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ─── Admin: Tabs ─── */}
//         {isAdmin && (
//           <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
//             {[
//               { key: 'my', label: 'My Attendance' },
//               { key: 'all', label: `All Students (${allUsers.length})` },
//             ].map(({ key, label }) => (
//               <button
//                 key={key}
//                 onClick={() => setActiveTab(key as 'my' | 'all')}
//                 className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
//                   activeTab === key
//                     ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
//                     : 'text-slate-400 hover:text-white'
//                 }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* ─── Admin: All Users Panel ─── */}
//         {isAdmin && activeTab === 'all' && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Users List */}
//             <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
//               <div className="p-4 border-b border-white/10">
//                 <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
//                   <Users className="w-4 h-4 text-cyan-400" />
//                   All Students
//                 </h2>
//                 <div className="relative">
//                   <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search by name, ID..."
//                     className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition-all"
//                   />
//                 </div>
//               </div>
//               <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
//                 {filteredUsers.map((user) => (
//                   <button
//                     key={user.id}
//                     onClick={() => handleUserChange(user)}
//                     className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-all text-left ${
//                       selectedUserId === user.employee_id ? 'bg-cyan-500/10 border-l-2 border-cyan-500' : ''
//                     }`}
//                   >
//                     <div>
//                       <p className="text-sm font-semibold">{user.name}</p>
//                       <p className="text-xs text-slate-500">
//                         {user.employee_id} · {user.department || 'No dept'}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`text-xs px-2 py-0.5 rounded-full ${
//                           user.user_type === 'admin'
//                             ? 'bg-violet-500/20 text-violet-400'
//                             : 'bg-slate-500/20 text-slate-400'
//                         }`}
//                       >
//                         {user.user_type}
//                       </span>
//                       <ChevronRight className="w-3 h-3 text-slate-600" />
//                     </div>
//                   </button>
//                 ))}
//                 {filteredUsers.length === 0 && (
//                   <p className="px-4 py-8 text-center text-slate-500 text-sm">No users found</p>
//                 )}
//               </div>
//             </div>

//             {/* Selected User's Attendance */}
//             <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
//               <div className="p-5 border-b border-white/10 flex items-center justify-between">
//                 <div>
//                   <h2 className="font-bold flex items-center gap-2">
//                     <BarChart3 className="w-4 h-4 text-cyan-400" />
//                     {selectedUserInfo ? `${selectedUserInfo.name}'s Attendance` : 'Attendance Logs'}
//                   </h2>
//                   {selectedUserInfo && (
//                     <p className="text-xs text-slate-500 mt-0.5">
//                       {selectedUserInfo.email} · {selectedUserInfo.department}
//                     </p>
//                   )}
//                 </div>
//                 <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
//                   {attendanceLogs.length} records
//                 </span>
//               </div>
//               <AttendanceTable logs={attendanceLogs} formatDate={formatDate} formatTime={formatTime} />
//             </div>
//           </div>
//         )}

//         {/* ─── My Attendance (Employee + Admin's own) ─── */}
//         {(!isAdmin || activeTab === 'my') && (
//           <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
//             <div className="p-5 border-b border-white/10 flex items-center justify-between">
//               <h2 className="font-bold flex items-center gap-2">
//                 <BarChart3 className="w-4 h-4 text-cyan-400" />
//                 My Attendance History
//               </h2>
//               <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
//                 {attendanceLogs.length} records
//               </span>
//             </div>
//             <AttendanceTable logs={attendanceLogs} formatDate={formatDate} formatTime={formatTime} />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// /* ─── Attendance Table Component ─── */
// function AttendanceTable({
//   logs,
//   formatDate,
//   formatTime,
// }: {
//   logs: AttendanceLog[];
//   formatDate: (d: string) => string;
//   formatTime: (d: string) => string;
// }) {
//   if (logs.length === 0) {
//     return (
//       <div className="py-16 text-center">
//         <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
//           <Calendar className="w-5 h-5 text-slate-500" />
//         </div>
//         <p className="text-slate-400 font-medium">No attendance records found</p>
//         <p className="text-slate-600 text-sm mt-1">Records will appear here once attendance is marked</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
//       <table className="w-full">
//         <thead className="sticky top-0 bg-[#0d1424] border-b border-white/10">
//           <tr>
//             {['Date', 'Login Time', 'Logout Time', 'Duration', 'Status'].map((h) => (
//               <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-white/5">
//           {logs.map((log) => {
//             const duration = log.logout_time
//               ? (() => {
//                   const mins =
//                     (new Date(log.logout_time).getTime() - new Date(log.login_time).getTime()) / 60000;
//                   return `${Math.floor(mins / 60)}h ${Math.floor(mins % 60)}m`;
//                 })()
//               : '—';

//             const isIn = log.status === 'logged_in' || log.status === 'present';

//             return (
//               <tr key={log.id} className="hover:bg-white/5 transition-colors">
//                 <td className="px-5 py-3.5 text-sm font-medium">{formatDate(log.login_time)}</td>
//                 <td className="px-5 py-3.5 text-sm text-cyan-400 font-mono">{formatTime(log.login_time)}</td>
//                 <td className="px-5 py-3.5 text-sm text-slate-400 font-mono">
//                   {log.logout_time ? formatTime(log.logout_time) : '—'}
//                 </td>
//                 <td className="px-5 py-3.5 text-sm text-slate-300">{duration}</td>
//                 <td className="px-5 py-3.5">
//                   <span
//                     className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
//                       isIn
//                         ? 'bg-emerald-500/15 text-emerald-400'
//                         : 'bg-slate-500/15 text-slate-400'
//                     }`}
//                   >
//                     {isIn ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
//                     {isIn ? 'Present' : 'Logged Out'}
//                   </span>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock, Calendar, User, LogOut, Camera, CheckCircle, XCircle, BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '../../hooks/use-toast';

type UserType = {
  id: string;
  name: string;
  employee_id: string;
  email: string;
  department: string;
  user_type: 'admin' | 'user';
};

type AttendanceLog = {
  id: string;
  user_id: string;
  login_time: string;
  logout_time?: string;
  status: 'present' | 'absent' | 'logged_in' | 'logged_out';
};

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const employeeId = sessionStorage.getItem('currentEmployeeId');

        if (!employeeId) {
          router.push('/login');
          return;
        }

        const userRes = await fetch(`http://127.0.0.1:8000/api/users/${employeeId}/`);
        const userData = await userRes.json();

        if (!userData) {
          toast({ title: 'Error', description: 'User not found', variant: 'destructive' });
          router.push('/login');
          return;
        }

        // ✅ redirect admin to admin dashboard
        if (userData.user_type === 'admin') {
          router.push('/admin');
          return;
        }

        setCurrentUser(userData);
        await loadAttendanceLogs(userData.employee_id);
      } catch {
        toast({ title: 'Error', description: 'Failed to load dashboard', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const loadAttendanceLogs = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/attendance/${userId}/`);
      const data = await res.json();
      setAttendanceLogs(data || []);
    } catch {
      console.error('Failed to load attendance logs');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentEmployeeId');
    sessionStorage.removeItem('userType');
    router.push('/login');
    toast({ title: 'Success', description: 'Logged out successfully' });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const getTodaysPresent = () => {
    const today = new Date().toDateString();
    return attendanceLogs.filter((l) => new Date(l.login_time).toDateString() === today).length;
  };

  const getTotalWorkingHours = () => {
    const today = new Date().toDateString();
    const logs = attendanceLogs.filter((l) => new Date(l.login_time).toDateString() === today);
    let mins = 0;
    logs.forEach((l) => {
      if (l.logout_time) {
        mins += (new Date(l.logout_time).getTime() - new Date(l.login_time).getTime()) / 60000;
      }
    });
    return `${Math.floor(mins / 60)}h ${Math.floor(mins % 60)}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* ─── Header ─── */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">MarkYourAttendance</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">
              Mark Attendance
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs text-slate-500">👤 Student · {currentUser.employee_id}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: User, label: 'Name', value: currentUser.name.split(' ')[0], color: 'cyan' },
            { icon: Calendar, label: 'Student ID', value: currentUser.employee_id, color: 'blue' },
            { icon: Clock, label: "Today's Hours", value: getTotalWorkingHours(), color: 'violet' },
            { icon: CheckCircle, label: "Today's Logs", value: String(getTodaysPresent()), color: 'emerald' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                color === 'cyan' ? 'bg-cyan-500/15 text-cyan-400'
                : color === 'blue' ? 'bg-blue-500/15 text-blue-400'
                : color === 'violet' ? 'bg-violet-500/15 text-violet-400'
                : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-xl font-bold truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Attendance Table ─── */}
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              My Attendance History
            </h2>
            <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              {attendanceLogs.length} records
            </span>
          </div>
          <AttendanceTable logs={attendanceLogs} formatDate={formatDate} formatTime={formatTime} />
        </div>
      </main>
    </div>
  );
}

/* ─── Attendance Table ─── */
function AttendanceTable({
  logs, formatDate, formatTime,
}: {
  logs: AttendanceLog[];
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
}) {
  if (logs.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-slate-400 font-medium">No attendance records found</p>
        <p className="text-slate-600 text-sm mt-1">Records will appear here once attendance is marked</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-[#0d1424] border-b border-white/10">
          <tr>
            {['Date', 'Login Time', 'Logout Time', 'Duration', 'Status'].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {logs.map((log) => {
            const duration = log.logout_time
              ? (() => {
                  const mins = (new Date(log.logout_time).getTime() - new Date(log.login_time).getTime()) / 60000;
                  return `${Math.floor(mins / 60)}h ${Math.floor(mins % 60)}m`;
                })()
              : '—';
            const isIn = log.status === 'logged_in' || log.status === 'present';
            return (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium">{formatDate(log.login_time)}</td>
                <td className="px-5 py-3.5 text-sm text-cyan-400 font-mono">{formatTime(log.login_time)}</td>
                <td className="px-5 py-3.5 text-sm text-slate-400 font-mono">
                  {log.logout_time ? formatTime(log.logout_time) : '—'}
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-300">{duration}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isIn ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                  }`}>
                    {isIn ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {isIn ? 'Present' : 'Logged Out'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}