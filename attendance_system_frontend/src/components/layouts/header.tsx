// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Camera, LogOut } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// interface HeaderProps {
//   userName?: string;
//   onLogout?: () => void;
// }

// export function Header({ userName, onLogout }: HeaderProps) {
//   const pathname = usePathname();

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
//               <Camera className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-xl font-bold text-slate-900">Mark Your Attendance</span>
//           </Link>

//           <div className="flex items-center gap-6">
//             {pathname !== '/' && (
//               <nav className="hidden md:flex gap-6">
//                 <Link
//                   href="/register"
//                   className={`text-sm font-medium transition-colors ${
//                     pathname === '/register'
//                       ? 'text-blue-600'
//                       : 'text-slate-600 hover:text-slate-900'
//                   }`}
//                 >
//                   Register
//                 </Link>
//                 <Link
//                   href="/login"
//                   className={`text-sm font-medium transition-colors ${
//                     pathname === '/login'
//                       ? 'text-blue-600'
//                       : 'text-slate-600 hover:text-slate-900'
//                   }`}
//                 >
//                   Login
//                 </Link>
//                 {userName && (
//                   <Link
//                     href="/dashboard"
//                     className={`text-sm font-medium transition-colors ${
//                       pathname === '/dashboard'
//                         ? 'text-blue-600'
//                         : 'text-slate-600 hover:text-slate-900'
//                     }`}
//                   >
//                     Dashboard
//                   </Link>
//                 )}
//               </nav>
//             )}

//             {userName && (
//               <div className="flex items-center gap-4">
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-slate-900">{userName}</p>
//                   <p className="text-xs text-slate-500">Logged in</p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={onLogout}
//                   className="text-slate-600 hover:text-red-600"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export function Header({ userName, onLogout }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            MarkYourAttendance
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {pathname !== '/' && (
            <nav className="hidden md:flex gap-6">
              <Link
                href="/register"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/register'
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </Link>

              <Link
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/login'
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Login
              </Link>

              {userName && (
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          )}

          {/* User Info */}
          {userName && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-slate-500">Logged in</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}