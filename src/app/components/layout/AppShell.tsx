import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Target, History, User, LogOut, ChevronLeft, ChevronRight, Menu, X, Zap, Bell } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../shared/Logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/analyzer", icon: Target, label: "Analyzer" },
    { to: "/history", icon: History, label: "History" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0 bg-gradient-to-b from-primary/5 to-transparent", collapsed && !onClose && "justify-center")}>
        {collapsed && !onClose ? <Logo showText={false} size={28} /> : <Logo />}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border-l-2",
              isActive ? "bg-primary/15 text-primary border-primary" : "border-transparent text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/5"
            )}>
            <Icon className="size-4.5 flex-shrink-0" />
            {(!collapsed || onClose) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-2 space-y-0.5">
        {(!collapsed || onClose) && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-primary">{user.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/40 truncate capitalize">{user.plan} plan</p>
            </div>
          </div>
        )}
        <button onClick={() => { logout(); nav("/"); toast.success("Logged out"); }}
          className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/8 transition-all", collapsed && !onClose && "justify-center")}>
          <LogOut className="size-4 flex-shrink-0" />
          {(!collapsed || onClose) && <span>Log out</span>}
        </button>
        {!onClose && (
          <button onClick={() => setCollapsed(c => !c)}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm text-sidebar-foreground/30 hover:text-sidebar-foreground hover:bg-white/5 transition-all", collapsed && "justify-center")}>
            {collapsed ? <ChevronRight className="size-4" /> : <><ChevronLeft className="size-4" /><span>Collapse</span></>}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <motion.aside animate={{ width: collapsed ? 64 : 240 }} transition={{ duration: 0.28, ease: "easeInOut" }}
        className="hidden md:flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden flex-shrink-0">
        <SidebarContent />
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 md:hidden flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-sidebar-foreground/40 hover:text-sidebar-foreground">
              <X className="size-5" />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </motion.aside>
        </>}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-background/70 backdrop-blur-xl flex items-center px-4 md:px-6 gap-4 flex-shrink-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground">
            <Menu className="size-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {user?.plan === "free" && (
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-accent/15 text-accent hover:bg-accent/25 transition-colors">
                <Zap className="size-3" /> Upgrade
              </button>
            )}
            <button className="relative size-9 rounded-xl flex items-center justify-center hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="size-4.5" />
              <span className="absolute top-2 right-2 size-1.5 bg-accent rounded-full" />
            </button>
            <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-300" onClick={() => nav("/profile")}>
              <span className="text-xs font-black text-primary">{user?.name.charAt(0)}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="min-h-full relative">
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
