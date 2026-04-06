'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock, Calendar, User, LogOut, Camera, ChevronRight,
  Users, CheckCircle, XCircle, Search, BarChart3, ShieldCheck,
  TrendingUp, AlertTriangle, Download, Filter, Activity,
  UserCheck, UserX, Flame, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '../../hooks/use-toast';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────
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

type SidebarTab = 'overview' | 'students' | 'analytics' | 'alerts';

// ─── Constants ───────────────────────────────────────────
const LATE_THRESHOLD_HOUR = 9;
const LOW_ATTENDANCE_THRESHOLD = 75;
const ABSENT_STREAK_THRESHOLD = 3;
const DEPT_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// ─── Helpers ─────────────────────────────────────────────
const fmt = (d: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(d).toLocaleDateString('en-IN', opts);
const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
const fmtDate = (d: string) =>
  fmt(d, { month: 'short', day: 'numeric', year: 'numeric' });

function calcDuration(login: string, logout?: string) {
  if (!logout) return null;
  const mins = (new Date(logout).getTime() - new Date(login).getTime()) / 60000;
  return { hrs: Math.floor(mins / 60), mins: Math.floor(mins % 60), total: mins };
}

// ─── Main Component ──────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [allLogs, setAllLogs] = useState<AttendanceLog[]>([]);

  const [logsCache, setLogsCache] = useState<Record<string, AttendanceLog[]>>({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<AttendanceLog[]>([]);
  const [loadingSelected, setLoadingSelected] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('overview');
  const [myLogs, setMyLogs] = useState<AttendanceLog[]>([]);

  // ── Load Data ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const empId = sessionStorage.getItem('currentEmployeeId');
        if (!empId) { router.push('/login'); return; }

        const [userRes, usersRes, logsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/users/${empId}/`),
          fetch('http://localhost:8000/api/users/'),
          fetch('http://localhost:8000/api/attendance/'),
        ]);

        const [userData, usersData, logsData] = await Promise.all([
          userRes.json(), usersRes.json(), logsRes.json(),
        ]);

        if (!userData || userData.user_type !== 'admin') {
          router.push('/dashboard'); return;
        }

        setCurrentUser(userData);
        setAllUsers(usersData || []);
        setAllLogs(logsData || []);

        const myRes = await fetch(`http://localhost:8000/api/attendance/${empId}/`);
        const myData = await myRes.json();
        setMyLogs(myData || []);
        setLogsCache(prev => ({ ...prev, [empId]: myData || [] }));

      } catch {
        toast({ title: 'Error', description: 'Failed to load dashboard', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [router]);

  // ── 🔑 KEY FIX: Filter to only students in admin's department ──
  // Excludes: (1) all admins, (2) students from other departments
  const deptStudents = useMemo(() => {
    if (!currentUser) return [];
    return allUsers.filter(
      u => u.user_type !== 'admin' && u.department === currentUser.department
    );
  }, [allUsers, currentUser]);

  // Also filter logs to only include logs belonging to deptStudents
  const deptStudentIds = useMemo(
    () => new Set(deptStudents.map(u => u.id)),
    [deptStudents]
  );

  const deptLogs = useMemo(
    () => allLogs.filter(l => deptStudentIds.has(l.user_id)),
    [allLogs, deptStudentIds]
  );

  // ── Select Student (with cache) ────────────────────────
  const handleSelectUser = async (user: UserType) => {
    setSelectedEmployeeId(user.employee_id);

    if (logsCache[user.employee_id]) {
      setSelectedLogs(logsCache[user.employee_id]);
      return;
    }

    setLoadingSelected(true);
    try {
      const res = await fetch(`http://localhost:8000/api/attendance/${user.employee_id}/`);
      const data = await res.json();
      const logs = data || [];
      setLogsCache(prev => ({ ...prev, [user.employee_id]: logs }));
      setSelectedLogs(logs);
    } catch {
      toast({ title: 'Error', description: 'Failed to load logs', variant: 'destructive' });
    } finally {
      setLoadingSelected(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentEmployeeId');
    sessionStorage.removeItem('userType');
    router.push('/login');
    toast({ title: 'Success', description: 'Logged out successfully' });
  };

  // ── Computed Stats (all use deptStudents / deptLogs) ──
  const today = new Date().toDateString();

  const todayStats = useMemo(() => {
    const latestByUser = new Map<string, AttendanceLog>();
    // Only look at logs for students in this admin's department
    deptLogs.forEach(log => {
      if (new Date(log.login_time).toDateString() === today) {
        const ex = latestByUser.get(log.user_id);
        if (!ex || new Date(log.login_time) > new Date(ex.login_time))
          latestByUser.set(log.user_id, log);
      }
    });
    const present = Array.from(latestByUser.values()).filter(
      l => l.status === 'logged_in' || l.status === 'present'
    ).length;
    const loggedOut = Array.from(latestByUser.values()).filter(
      l => l.status === 'logged_out'
    ).length;
    const absent = deptStudents.length - present - loggedOut;
    const late = Array.from(latestByUser.values()).filter(
      l => new Date(l.login_time).getHours() >= LATE_THRESHOLD_HOUR
    ).length;
    return {
      present,
      loggedOut,
      absent: Math.max(0, absent),
      late,
      total: deptStudents.length, // ✅ only counts students in this dept
    };
  }, [deptLogs, deptStudents, today]);

  // ── Today's present IDs (dept-scoped) ────────────────
  const presentTodayIds = useMemo(() => new Set(
    deptLogs
      .filter(l =>
        new Date(l.login_time).toDateString() === today &&
        (l.status === 'logged_in' || l.status === 'present')
      )
      .map(l => l.user_id)
  ), [deptLogs, today]);

  // ── Department breakdown (within this admin's dept only) ──
  // Since all deptStudents belong to the same department, we show
  // a simple present vs absent breakdown for the department
  const deptData = useMemo(() => {
    // Group by sub-department or just show the one dept
    const map = new Map<string, { total: number; present: number }>();
    deptStudents.forEach(u => {
      const dept = u.department || 'Unknown';
      if (!map.has(dept)) map.set(dept, { total: 0, present: 0 });
      map.get(dept)!.total++;
    });
    deptStudents.forEach(u => {
      if (presentTodayIds.has(u.id)) {
        const dept = u.department || 'Unknown';
        map.get(dept)!.present++;
      }
    });
    return Array.from(map.entries()).map(([name, v]) => ({
      name,
      ...v,
      absent: v.total - v.present,
    }));
  }, [deptStudents, presentTodayIds]);

  // ── Last 30 days chart (dept-scoped) ──────────────────
  const last30Days = useMemo(() => {
    const days: { date: string; present: number; absent: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      const presentSet = new Set(
        deptLogs
          .filter(l => new Date(l.login_time).toDateString() === ds)
          .map(l => l.user_id)
      );
      days.push({
        date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        present: presentSet.size,
        absent: Math.max(0, deptStudents.length - presentSet.size),
      });
    }
    return days;
  }, [deptLogs, deptStudents]);

  // ── Attendance % per student (dept-scoped) ────────────
  const studentAttendance = useMemo(() => {
    const totalDays = 30;
    return deptStudents.map(u => {
      const uniqueDays = new Set(
        deptLogs
          .filter(l => l.user_id === u.id)
          .map(l => new Date(l.login_time).toDateString())
      ).size;
      const pct = Math.round((uniqueDays / totalDays) * 100);
      return { ...u, attendancePct: pct, daysPresent: uniqueDays };
    }).sort((a, b) => a.attendancePct - b.attendancePct);
  }, [deptLogs, deptStudents]);

  // ── Alerts (dept-scoped) ──────────────────────────────
  const alerts = useMemo(() => {
    const list: { user: UserType; type: 'low' | 'streak'; detail: string }[] = [];
    studentAttendance.forEach(u => {
      if (u.attendancePct < LOW_ATTENDANCE_THRESHOLD)
        list.push({ user: u, type: 'low', detail: `${u.attendancePct}% attendance` });
    });
    deptStudents.forEach(u => {
      let streak = 0;
      for (let i = 0; i < ABSENT_STREAK_THRESHOLD + 2; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const ds = d.toDateString();
        const present = deptLogs.some(
          l => l.user_id === u.id && new Date(l.login_time).toDateString() === ds
        );
        if (!present) streak++; else break;
      }
      if (streak >= ABSENT_STREAK_THRESHOLD)
        list.push({ user: u, type: 'streak', detail: `Absent ${streak} days in a row` });
    });
    return list;
  }, [studentAttendance, deptStudents, deptLogs]);

  // ── Departments for filter (only from deptStudents) ───
  const departments = useMemo(() => [
    'all',
    ...Array.from(new Set(deptStudents.map(u => u.department).filter(Boolean))),
  ], [deptStudents]);

  // ── Filtered students (dept-scoped base) ─────────────
  const filteredUsers = useMemo(() => deptStudents.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q ||
      u.name.toLowerCase().includes(q) ||
      u.employee_id.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q);
    const matchDept = deptFilter === 'all' || u.department === deptFilter;
    const matchStatus = statusFilter === 'all'
      || (statusFilter === 'present' && presentTodayIds.has(u.id))
      || (statusFilter === 'absent' && !presentTodayIds.has(u.id));
    return matchQ && matchDept && matchStatus;
  }), [deptStudents, searchQuery, deptFilter, statusFilter, presentTodayIds]);

  const selectedUserInfo = deptStudents.find(u => u.employee_id === selectedEmployeeId);

  // ── My working hours ──────────────────────────────────
  const myHoursToday = useMemo(() => {
    const logs = myLogs.filter(l => new Date(l.login_time).toDateString() === today);
    let mins = 0;
    logs.forEach(l => {
      if (l.logout_time) mins += calcDuration(l.login_time, l.logout_time)?.total ?? 0;
    });
    return `${Math.floor(mins / 60)}h ${Math.floor(mins % 60)}m`;
  }, [myLogs, today]);

  // ── CSV Export ────────────────────────────────────────
  const handleExport = () => {
    const logsToExport = selectedLogs.length > 0 ? selectedLogs : deptLogs;
    const header = 'Student ID,Name,Date,Login,Logout,Duration,Status\n';
    const rows = logsToExport.map(log => {
      const user = deptStudents.find(u => u.id === log.user_id);
      const dur = calcDuration(log.login_time, log.logout_time);
      return [
        user?.employee_id || log.user_id,
        user?.name || 'Unknown',
        fmtDate(log.login_time),
        fmtTime(log.login_time),
        log.logout_time ? fmtTime(log.logout_time) : '—',
        dur ? `${dur.hrs}h ${dur.mins}m` : '—',
        log.status,
      ].join(',');
    });
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `attendance_${currentUser?.department}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Filtered logs by date range ───────────────────────
  const filteredSelectedLogs = useMemo(() => {
    return selectedLogs.filter(l => {
      const d = new Date(l.login_time);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [selectedLogs, dateFrom, dateTo]);

  // ── Loading ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080d1a] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm tracking-wide">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  // ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080d1a] text-white font-sans flex flex-col">

      {/* ══ Header ══════════════════════════════════════ */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">MarkYourAttendance</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-semibold">
              Admin
            </span>
            {/* Show which department this admin manages */}
            {currentUser.department && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                {currentUser.department}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">
              Mark Attendance
            </Link>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-xs font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs text-slate-500">🛡 Admin · {currentUser.employee_id}</p>
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

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">

        {/* ══ Sidebar ══════════════════════════════════ */}
        <aside className="w-56 border-r border-white/10 bg-white/[0.02] min-h-screen sticky top-16 self-start pt-6 px-3 hidden lg:block">
          {([
            { key: 'overview', icon: Activity, label: 'Overview' },
            { key: 'students', icon: Users, label: 'Students' },
            { key: 'analytics', icon: BarChart3, label: 'Analytics' },
            { key: 'alerts', icon: AlertTriangle, label: `Alerts` },
          ] as const).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setSidebarTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                sidebarTab === key
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {key === 'alerts' && alerts.length > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center font-bold">
                  {alerts.length}
                </span>
              )}
            </button>
          ))}

          {/* My attendance shortcut */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-600 px-4 mb-2 uppercase tracking-wider">My Stats Today</p>
            <div className="px-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Hours</span>
                <span className="text-cyan-400 font-semibold">{myHoursToday}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Logs</span>
                <span className="text-cyan-400 font-semibold">
                  {myLogs.filter(l => new Date(l.login_time).toDateString() === today).length}
                </span>
              </div>
            </div>

            {/* Dept scope info */}
            <div className="mt-4 mx-2 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs text-slate-500 mb-1">Viewing dept</p>
              <p className="text-sm font-bold text-cyan-400">{currentUser.department || 'All'}</p>
              <p className="text-xs text-slate-600 mt-0.5">{deptStudents.length} students</p>
            </div>
          </div>
        </aside>

        {/* ══ Main Content ═════════════════════════════ */}
        <main className="flex-1 px-6 py-8 space-y-8 min-w-0">

          {/* ── OVERVIEW ─────────────────────────────── */}
          {sidebarTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Good {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                  {' · '}
                  <span className="text-cyan-400 font-medium">{currentUser.department} Department</span>
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: Users, label: 'Total Students', value: todayStats.total,
                    color: 'cyan', sub: `in ${currentUser.department}`,
                  },
                  {
                    icon: UserCheck, label: 'Present Today', value: todayStats.present,
                    color: 'emerald',
                    sub: `${Math.round((todayStats.present / todayStats.total) * 100) || 0}% rate`,
                  },
                  {
                    icon: UserX, label: 'Absent Today', value: todayStats.absent,
                    color: 'red', sub: 'not checked in',
                  },
                  {
                    icon: Clock, label: 'Late Arrivals', value: todayStats.late,
                    color: 'amber', sub: `after ${LATE_THRESHOLD_HOUR}:00 AM`,
                  },
                ].map(({ icon: Icon, label, value, color, sub }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3 hover:bg-white/8 transition-all"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      color === 'cyan' ? 'bg-cyan-500/15 text-cyan-400'
                      : color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400'
                      : color === 'red' ? 'bg-red-500/15 text-red-400'
                      : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 30-day bar chart */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="font-bold mb-4 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Attendance Rate — Last 30 Days ({currentUser.department})
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={last30Days} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        background: '#0d1424',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="present" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Present" />
                    <Bar dataKey="absent" fill="rgba(255,255,255,0.05)" radius={[2, 2, 0, 0]} name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Dept summary + absent list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dept summary card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="font-bold mb-4 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    {currentUser.department} — Today's Summary
                  </h2>
                  <div className="space-y-3">
                    {deptData.map((d, i) => (
                      <div key={d.name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-300 font-medium">{d.name}</span>
                          <span className="text-slate-400">
                            {d.present}/{d.total} present
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-cyan-400 transition-all"
                            style={{ width: `${d.total > 0 ? (d.present / d.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {deptData.length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-4">No data available</p>
                    )}
                  </div>
                </div>

                {/* Absent today */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="font-bold mb-4 text-sm flex items-center gap-2">
                    <UserX className="w-4 h-4 text-red-400" />
                    Absent Today ({todayStats.absent})
                  </h2>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {deptStudents.filter(u => !presentTodayIds.has(u.id)).slice(0, 20).map(u => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/8 transition-all"
                      >
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.employee_id} · {u.department || 'No dept'}</p>
                        </div>
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                          Absent
                        </span>
                      </div>
                    ))}
                    {todayStats.absent === 0 && (
                      <p className="text-slate-500 text-sm text-center py-4">🎉 Everyone is present!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STUDENTS ─────────────────────────────── */}
          {sidebarTab === 'students' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left: Student List */}
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      {currentUser.department} Students
                    </h2>
                    <span className="text-xs text-slate-500">{filteredUsers.length} shown</span>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search name, ID..."
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition-all"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={deptFilter}
                      onChange={e => setDeptFilter(e.target.value)}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {departments.map(d => (
                        <option key={d} value={d} className="bg-[#0d1424]">
                          {d === 'all' ? 'All Depts' : d}
                        </option>
                      ))}
                    </select>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all" className="bg-[#0d1424]">All Status</option>
                      <option value="present" className="bg-[#0d1424]">Present</option>
                      <option value="absent" className="bg-[#0d1424]">Absent</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                  {filteredUsers.map(user => {
                    const isPresent = presentTodayIds.has(user.id);
                    const attPct = studentAttendance.find(s => s.id === user.id)?.attendancePct ?? 0;
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-all text-left ${
                          selectedEmployeeId === user.employee_id
                            ? 'bg-cyan-500/10 border-l-2 border-cyan-500'
                            : ''
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            {attPct < LOW_ATTENDANCE_THRESHOLD && (
                              <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {user.employee_id} · {user.department || 'No dept'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isPresent
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {isPresent ? 'In' : 'Out'}
                          </span>
                          <ChevronRight className="w-3 h-3 text-slate-600" />
                        </div>
                      </button>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <p className="px-4 py-8 text-center text-slate-500 text-sm">No students found</p>
                  )}
                </div>
              </div>

              {/* Right: Selected Student Detail */}
              <div className="lg:col-span-3 space-y-4">
                {!selectedUserInfo ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">Select a student to view details</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-bold">{selectedUserInfo.name}</h2>
                          <p className="text-slate-400 text-sm mt-0.5">{selectedUserInfo.email}</p>
                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                              {selectedUserInfo.employee_id}
                            </span>
                            <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                              {selectedUserInfo.department || 'No dept'}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              presentTodayIds.has(selectedUserInfo.id)
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {presentTodayIds.has(selectedUserInfo.id) ? '✓ Present Today' : '✗ Absent Today'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {(() => {
                            const pct = studentAttendance.find(s => s.id === selectedUserInfo.id)?.attendancePct ?? 0;
                            return (
                              <div>
                                <p className={`text-3xl font-extrabold ${
                                  pct < LOW_ATTENDANCE_THRESHOLD ? 'text-red-400' : 'text-emerald-400'
                                }`}>
                                  {pct}%
                                </p>
                                <p className="text-xs text-slate-500">30-day attendance</p>
                                {pct < LOW_ATTENDANCE_THRESHOLD && (
                                  <p className="text-xs text-amber-400 mt-1 flex items-center gap-1 justify-end">
                                    <AlertTriangle className="w-3 h-3" /> Low attendance
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Date range filter */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <label className="text-xs text-slate-500 whitespace-nowrap">From</label>
                        <input
                          type="date" value={dateFrom}
                          onChange={e => setDateFrom(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <label className="text-xs text-slate-500 whitespace-nowrap">To</label>
                        <input
                          type="date" value={dateTo}
                          onChange={e => setDateTo(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      {(dateFrom || dateTo) && (
                        <button
                          onClick={() => { setDateFrom(''); setDateTo(''); }}
                          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all"
                      >
                        <Download className="w-3 h-3" /> Export
                      </button>
                    </div>

                    {/* Attendance Table */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-cyan-400" />
                          Attendance Records
                        </h3>
                        <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                          {filteredSelectedLogs.length} records
                        </span>
                      </div>

                      {loadingSelected ? (
                        <div className="py-12 text-center">
                          <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto mb-3" />
                          <p className="text-slate-400 text-xs">Loading records...</p>
                        </div>
                      ) : (
                        <AttendanceTable
                          logs={filteredSelectedLogs}
                          formatDate={fmtDate}
                          formatTime={fmtTime}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ────────────────────────────── */}
          {sidebarTab === 'analytics' && (
            <div className="space-y-8">
              <h1 className="text-2xl font-extrabold tracking-tight">
                Analytics — {currentUser.department}
              </h1>

              {/* 30-day line chart */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="font-bold mb-4 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Daily Attendance — Last 30 Days
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={last30Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        background: '#0d1424',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="present" stroke="#06b6d4" strokeWidth={2} dot={false} name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={false} name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Dept bar — now shows present vs absent for this dept */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="font-bold mb-4 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  {currentUser.department} — Attendance Today
                </h2>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={deptData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} />
                    <Tooltip
                      contentStyle={{
                        background: '#0d1424',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="present" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Present" />
                    <Bar dataKey="absent" fill="rgba(239,68,68,0.3)" radius={[0, 4, 4, 0]} name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Attendance % leaderboard */}
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Attendance Leaderboard (30 days) — {deptStudents.length} students
                  </h2>
                </div>
                <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                  {[...studentAttendance].reverse().map((u, i) => (
                    <div
                      key={u.id}
                      className="px-5 py-3 flex items-center gap-4 hover:bg-white/5 transition-all"
                    >
                      <span className={`text-sm font-bold w-6 ${i < 3 ? 'text-amber-400' : 'text-slate-600'}`}>
                        #{studentAttendance.length - i}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.employee_id} · {u.department}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-white/10 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              u.attendancePct >= 75 ? 'bg-cyan-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${u.attendancePct}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold w-12 text-right ${
                          u.attendancePct >= 75 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {u.attendancePct}%
                        </span>
                        {u.attendancePct >= (studentAttendance[studentAttendance.length - 1]?.attendancePct ?? 0)
                          ? <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                          : <ArrowDownRight className="w-3 h-3 text-red-400" />
                        }
                      </div>
                    </div>
                  ))}
                  {studentAttendance.length === 0 && (
                    <p className="px-4 py-8 text-center text-slate-500 text-sm">No student data available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ALERTS ───────────────────────────────── */}
          {sidebarTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Alerts — {currentUser.department}
                </h1>
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-semibold">
                  {alerts.length} active
                </span>
              </div>

              {alerts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-slate-300 font-semibold">All clear!</p>
                  <p className="text-slate-500 text-sm mt-1">No alerts at this time</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 flex items-start gap-4 ${
                        alert.type === 'low'
                          ? 'border-amber-500/20 bg-amber-500/5'
                          : 'border-red-500/20 bg-red-500/5'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.type === 'low' ? 'bg-amber-500/20' : 'bg-red-500/20'
                      }`}>
                        {alert.type === 'low'
                          ? <AlertTriangle className="w-4 h-4 text-amber-400" />
                          : <XCircle className="w-4 h-4 text-red-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{alert.user.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {alert.user.employee_id} · {alert.user.department}
                        </p>
                        <p className={`text-xs font-medium mt-1 ${
                          alert.type === 'low' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          ⚠ {alert.detail}
                        </p>
                      </div>
                      <button
                        onClick={() => { setSidebarTab('students'); handleSelectUser(alert.user); }}
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all whitespace-nowrap"
                      >
                        View →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ─── Greeting helper ─────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// ─── Attendance Table ─────────────────────────────────────
function AttendanceTable({
  logs, formatDate, formatTime,
}: {
  logs: AttendanceLog[];
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
}) {
  if (logs.length === 0) {
    return (
      <div className="py-14 text-center">
        <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 text-sm font-medium">No records found</p>
        <p className="text-slate-600 text-xs mt-1">Try adjusting the date range</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-[#0d1424] border-b border-white/10">
          <tr>
            {['Date', 'Login', 'Logout', 'Duration', 'Status'].map(h => (
              <th
                key={h}
                className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {logs.map(log => {
            const dur = calcDuration(log.login_time, log.logout_time);
            const isIn = log.status === 'logged_in' || log.status === 'present';
            return (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 text-sm font-medium">{formatDate(log.login_time)}</td>
                <td className="px-5 py-3 text-sm text-cyan-400 font-mono">{formatTime(log.login_time)}</td>
                <td className="px-5 py-3 text-sm text-slate-400 font-mono">
                  {log.logout_time ? formatTime(log.logout_time) : '—'}
                </td>
                <td className="px-5 py-3 text-sm text-slate-300">
                  {dur ? `${dur.hrs}h ${dur.mins}m` : '—'}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isIn
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-slate-500/15 text-slate-400'
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