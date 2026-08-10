import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Building2,
  Droplet,
  Ambulance,
  FileCheck,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastNotification";

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      addToast("Administrator logged out successfully.", "info");
      navigate("/admin/login");
    } catch (error) {
      addToast("Failed to logout: " + error.message, "error");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      active: true,
      aliases: ["/admin"],
    },
    {
      name: "Hospitals",
      path: "/admin/hospitals",
      icon: Building2,
      active: true,
      aliases: ["/admin/hospitals/new"],
    },
    {
      name: "Blood Banks",
      path: "/admin/blood-banks",
      icon: Droplet,
      active: true,
      aliases: ["/admin/blood-banks/new"],
    },
    {
      name: "Ambulances",
      path: "#",
      icon: Ambulance,
      comingSoon: true,
    },
    {
      name: "Submissions",
      path: "#",
      icon: FileCheck,
      comingSoon: true,
    },
    {
      name: "Verification",
      path: "#",
      icon: ShieldCheck,
      comingSoon: true,
    },
    {
      name: "Settings",
      path: "#",
      icon: Settings,
      comingSoon: true,
    },
  ];

  const adminName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col max-w-full overflow-x-hidden">
      {/* ADMIN TOP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  medi<span className="text-sky-400">NAV</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-md">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs font-medium text-slate-300">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-white max-w-[120px] truncate">{adminName}</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold rounded-md uppercase">
                Administrator
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (SIDEBAR + OUTLET) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-4 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block">
              Management Modules
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isCurrentPath =
                  location.pathname === item.path ||
                  (item.aliases && item.aliases.includes(location.pathname));

                if (item.comingSoon) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed opacity-60"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-600" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                        Soon
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isCurrentPath
                        ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
            <div className="w-72 bg-slate-900 h-full p-5 space-y-4 border-r border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-black text-white">Admin Navigation</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrentPath =
                    location.pathname === item.path ||
                    (item.aliases && item.aliases.includes(location.pathname));

                  if (item.comingSoon) {
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed opacity-60"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-slate-600" />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                          Soon
                        </span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                        isCurrentPath
                          ? "bg-sky-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* MAIN ADMIN PAGE CONTENT OUTLET */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
