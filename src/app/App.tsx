import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useParams,
  useLocation,
} from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  FileText, Upload, Briefcase, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, Target, Zap, Star, Users, Award, ArrowRight, Download,
  Search, Bell, User, LogOut, Menu, X, ChevronRight, ChevronDown,
  BarChart2, Clock, Plus, Trash2, Eye, RefreshCw, Shield, Code,
  Lightbulb, Check, AlertCircle, Sparkles, Layers, Hash, LayoutDashboard,
  History, Mail, Lock, ChevronLeft, Globe, Phone, MapPin, Calendar,
  Edit3, Save,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// ─── Utils ────────────────────────────────────────────────────────────────────
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppUser {
  id: string; name: string; email: string; plan: "free" | "pro"; joinedAt: string;
}
interface SectionEntry { name: string; present: boolean; quality: "good" | "fair" | "poor" }
interface SkillEntry { name: string; matched: boolean }
interface AnalysisResult {
  id: string; createdAt: string; resumeFileName: string; jobTitle: string; company: string;
  atsScore: number; keywordScore: number; structureScore: number;
  completenessScore: number; readabilityScore: number;
  matchedKeywords: string[]; missingKeywords: string[];
  technicalSkills: SkillEntry[]; softSkills: SkillEntry[];
  strengths: string[]; weaknesses: string[]; suggestions: string[];
  sections: SectionEntry[]; wordCount: number; experienceYears: number; educationLevel: string;
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
interface AuthCtx {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
const AuthContext = createContext<AuthCtx>({ user: null, login: async () => false, register: async () => false, logout: () => {} });
const useAuth = () => useContext(AuthContext);

// ─── Analyses Context ─────────────────────────────────────────────────────────
interface AnalysesCtx {
  analyses: AnalysisResult[];
  addAnalysis: (a: AnalysisResult) => void;
  deleteAnalysis: (id: string) => void;
}
const AnalysesContext = createContext<AnalysesCtx>({ analyses: [], addAnalysis: () => {}, deleteAnalysis: () => {} });
const useAnalyses = () => useContext(AnalysesContext);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER: AppUser = { id: "u1", name: "Jordan Rivera", email: "jordan@example.com", plan: "pro", joinedAt: "2024-01-15" };

const MOCK_ANALYSES: AnalysisResult[] = [
  {
    id: "a1", createdAt: "2025-06-28T10:30:00Z", resumeFileName: "Jordan_Rivera_Resume.pdf",
    jobTitle: "Senior Frontend Engineer", company: "Stripe",
    atsScore: 84, keywordScore: 88, structureScore: 92, completenessScore: 76, readabilityScore: 80,
    matchedKeywords: ["React","TypeScript","Node.js","GraphQL","CI/CD","AWS","REST API","Agile","Jest","Webpack"],
    missingKeywords: ["Kubernetes","Docker","Redis","PostgreSQL","Microservices"],
    technicalSkills: [
      {name:"React",matched:true},{name:"TypeScript",matched:true},{name:"Node.js",matched:true},
      {name:"GraphQL",matched:true},{name:"Kubernetes",matched:false},{name:"Docker",matched:false},
      {name:"PostgreSQL",matched:false},{name:"Redis",matched:false},{name:"AWS",matched:true},{name:"Jest",matched:true},
    ],
    softSkills: [
      {name:"Communication",matched:true},{name:"Leadership",matched:true},
      {name:"Problem Solving",matched:true},{name:"Team Collaboration",matched:true},{name:"Time Management",matched:false},
    ],
    strengths: [
      "Strong technical skill alignment with 10 out of 15 required keywords",
      "Clear and well-structured professional summary",
      "Quantified achievements demonstrate measurable impact",
    ],
    weaknesses: [
      "Missing container orchestration technologies (Kubernetes, Docker)",
      "No database experience mentioned (PostgreSQL, Redis)",
      "Skills section lacks organization into categories",
    ],
    suggestions: [
      "Add Kubernetes and Docker to your skills section and projects",
      "Mention PostgreSQL or Redis in your database experience",
      "Include at least 2–3 more quantified achievements (%, $, time saved)",
      "Reorganize skills into Technical, Tools, and Soft Skills categories",
      "Add a dedicated Projects section showcasing personal work",
      "Tailor your summary to specifically mention distributed systems experience",
    ],
    sections: [
      {name:"Summary",present:true,quality:"good"},{name:"Experience",present:true,quality:"good"},
      {name:"Education",present:true,quality:"good"},{name:"Skills",present:true,quality:"fair"},
      {name:"Projects",present:false,quality:"poor"},{name:"Certifications",present:false,quality:"poor"},
    ],
    wordCount: 487, experienceYears: 6, educationLevel: "Bachelor's Degree",
  },
  {
    id: "a2", createdAt: "2025-06-20T14:00:00Z", resumeFileName: "Jordan_Rivera_Resume.pdf",
    jobTitle: "Full Stack Developer", company: "Notion",
    atsScore: 71, keywordScore: 72, structureScore: 85, completenessScore: 68, readabilityScore: 74,
    matchedKeywords: ["React","Node.js","TypeScript","REST API","MongoDB","Agile"],
    missingKeywords: ["Vue.js","Python","Elasticsearch","Kafka","gRPC","Terraform"],
    technicalSkills: [
      {name:"React",matched:true},{name:"Node.js",matched:true},{name:"Python",matched:false},
      {name:"Vue.js",matched:false},{name:"MongoDB",matched:true},{name:"Elasticsearch",matched:false},
    ],
    softSkills: [
      {name:"Communication",matched:true},{name:"Leadership",matched:false},
      {name:"Problem Solving",matched:true},{name:"Cross-functional",matched:false},
    ],
    strengths: ["Good React and Node.js coverage","Clear work history timeline"],
    weaknesses: ["Missing backend-heavy technologies","No cloud infrastructure experience"],
    suggestions: [
      "Add Python experience or projects to your portfolio",
      "Mention any experience with search tools like Elasticsearch",
      "Include cloud deployment experience (AWS, GCP, Azure)",
    ],
    sections: [
      {name:"Summary",present:true,quality:"fair"},{name:"Experience",present:true,quality:"good"},
      {name:"Education",present:true,quality:"good"},{name:"Skills",present:true,quality:"fair"},
      {name:"Projects",present:false,quality:"poor"},{name:"Certifications",present:false,quality:"poor"},
    ],
    wordCount: 412, experienceYears: 6, educationLevel: "Bachelor's Degree",
  },
  {
    id: "a3", createdAt: "2025-06-12T09:15:00Z", resumeFileName: "Jordan_Rivera_Resume.pdf",
    jobTitle: "Software Engineer II", company: "Datadog",
    atsScore: 91, keywordScore: 94, structureScore: 90, completenessScore: 88, readabilityScore: 92,
    matchedKeywords: ["React","TypeScript","Node.js","AWS","Jest","CI/CD","Agile","REST API","Git","Linux","Monitoring","Observability"],
    missingKeywords: ["Go","Prometheus"],
    technicalSkills: [
      {name:"React",matched:true},{name:"TypeScript",matched:true},{name:"Go",matched:false},
      {name:"Prometheus",matched:false},{name:"AWS",matched:true},{name:"Linux",matched:true},
    ],
    softSkills: [
      {name:"Communication",matched:true},{name:"Leadership",matched:true},
      {name:"Problem Solving",matched:true},{name:"Collaboration",matched:true},
    ],
    strengths: ["Excellent keyword coverage","Strong monitoring and observability alignment","Well-quantified experience"],
    weaknesses: ["Missing Go language experience","No mention of Prometheus or Grafana"],
    suggestions: ["Learn Go basics and mention in skills","Add Prometheus to monitoring toolset"],
    sections: [
      {name:"Summary",present:true,quality:"good"},{name:"Experience",present:true,quality:"good"},
      {name:"Education",present:true,quality:"good"},{name:"Skills",present:true,quality:"good"},
      {name:"Projects",present:true,quality:"good"},{name:"Certifications",present:true,quality:"good"},
    ],
    wordCount: 534, experienceYears: 6, educationLevel: "Bachelor's Degree",
  },
];

const DASHBOARD_TREND = [
  {month:"Jan",score:62},{month:"Feb",score:68},{month:"Mar",score:71},
  {month:"Apr",score:75},{month:"May",score:79},{month:"Jun",score:84},
];

// ─── ATS Algorithm ────────────────────────────────────────────────────────────
const TECH_SKILLS_DB = [
  "React","Vue","Angular","TypeScript","JavaScript","Node.js","Python","Java","Go","Rust",
  "AWS","GCP","Azure","Docker","Kubernetes","CI/CD","GraphQL","REST API","MongoDB","PostgreSQL",
  "Redis","MySQL","Elasticsearch","Kafka","Terraform","Linux","Git","Jest","Webpack","Vite",
  "Next.js","Express","FastAPI","Django","Microservices","Agile","Scrum","SQL","Machine Learning",
];
const SOFT_SKILLS_DB = [
  "Communication","Leadership","Problem Solving","Team Collaboration","Time Management",
  "Adaptability","Critical Thinking","Creativity","Project Management","Cross-functional","Mentoring",
];
const SECTION_PATTERNS: Record<string, string[]> = {
  Summary: ["summary","objective","profile","about"],
  Experience: ["experience","employment","work history","career"],
  Education: ["education","degree","university","college","academic"],
  Skills: ["skills","technologies","proficiencies","competencies"],
  Projects: ["projects","portfolio","open source"],
  Certifications: ["certifications","certificates","credentials","licenses"],
};

function runAtsAnalysis(resumeText: string, jobDesc: string, jobTitle: string, company: string, fileName: string): AnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDesc.toLowerCase();

  const jdKeywords = TECH_SKILLS_DB.filter(s => jdLower.includes(s.toLowerCase()));
  const jdWords = [...new Set(jobDesc.split(/\W+/).filter(w => w.length > 5 && !["where","which","their","there","about","would","could","should","might","these","those","other","after","before","above","below","under","while","being","having","making"].includes(w.toLowerCase())))].slice(0, 10);
  const allKw = [...new Set([...jdKeywords, ...jdWords])];

  const matched = allKw.filter(kw => resumeLower.includes(kw.toLowerCase()));
  const missing = allKw.filter(kw => !resumeLower.includes(kw.toLowerCase()));

  const technicalSkills = TECH_SKILLS_DB.filter(s => jdLower.includes(s.toLowerCase())).slice(0, 10).map(name => ({
    name, matched: resumeLower.includes(name.toLowerCase()),
  }));
  const softSkills = SOFT_SKILLS_DB.slice(0, 6).map(name => ({
    name, matched: resumeLower.includes(name.toLowerCase()),
  }));
  const sections = Object.entries(SECTION_PATTERNS).map(([name, patterns]) => {
    const present = patterns.some(p => resumeLower.includes(p));
    return { name, present, quality: (present ? "good" : "poor") as "good" | "fair" | "poor" };
  });

  const keywordScore = allKw.length > 0 ? Math.round((matched.length / allKw.length) * 100) : 65;
  const structureScore = Math.round((sections.filter(s => s.present).length / sections.length) * 100);
  const completenessScore = Math.min(99, Math.max(30, Math.round(resumeText.split(/\s+/).length / 4.5)));
  const readabilityScore = 55 + Math.floor(Math.random() * 38);
  const atsScore = Math.round(keywordScore * 0.4 + structureScore * 0.3 + completenessScore * 0.15 + readabilityScore * 0.15);

  return {
    id: `a${Date.now()}`,
    createdAt: new Date().toISOString(),
    resumeFileName: fileName, jobTitle, company,
    atsScore: Math.min(99, Math.max(25, atsScore)),
    keywordScore: Math.min(99, Math.max(25, keywordScore)),
    structureScore: Math.min(99, Math.max(25, structureScore)),
    completenessScore: Math.min(99, Math.max(25, completenessScore)),
    readabilityScore: Math.min(99, Math.max(25, readabilityScore)),
    matchedKeywords: matched,
    missingKeywords: missing,
    technicalSkills,
    softSkills,
    strengths: [
      matched.length > 4 ? `Strong alignment — ${matched.length} of ${allKw.length} keywords matched` : "Shows relevant experience for this role",
      sections.filter(s => s.present).length >= 4 ? "Well-structured with all major sections present" : "Core sections identified",
      resumeText.split(/\s+/).length > 250 ? "Resume has sufficient content depth" : "Consider expanding experience descriptions",
    ].filter(Boolean) as string[],
    weaknesses: [
      missing.length > 3 ? `${missing.length} keywords from the job description are missing` : null,
      sections.filter(s => !s.present).length > 1 ? "Several key resume sections are absent" : null,
      resumeText.split(/\s+/).length < 200 ? "Resume may be too brief; add more detail" : null,
    ].filter(Boolean) as string[],
    suggestions: [
      ...missing.slice(0, 3).map(kw => `Add "${kw}" to your skills or experience`),
      "Quantify achievements with metrics (%, $, hours saved)",
      "Tailor your summary to the specific job title",
      sections.find(s => s.name === "Projects" && !s.present) ? "Add a Projects section to showcase your work" : null,
      "Use strong action verbs to open each bullet point",
    ].filter(Boolean) as string[],
    sections,
    wordCount: resumeText.split(/\s+/).length,
    experienceYears: 3 + Math.floor(Math.random() * 7),
    educationLevel: "Bachelor's Degree",
  };
}

// ─── Auth Provider ────────────────────────────────────────────────────────────
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try { const s = localStorage.getItem("rm_user"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 1000));
    if (email && password.length >= 6) {
      const u = { ...MOCK_USER, email };
      setUser(u); localStorage.setItem("rm_user", JSON.stringify(u)); return true;
    }
    return false;
  };
  const register = async (name: string, email: string, password: string) => {
    await new Promise(r => setTimeout(r, 1200));
    if (name && email && password.length >= 6) {
      const u = { ...MOCK_USER, name, email, plan: "free" as const };
      setUser(u); localStorage.setItem("rm_user", JSON.stringify(u)); return true;
    }
    return false;
  };
  const logout = () => { setUser(null); localStorage.removeItem("rm_user"); };
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#059669" />
        <path d="M10 10h12a6 6 0 010 12H10V10z" fill="white" fillOpacity="0.95" />
        <path d="M10 24h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 29h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="29" cy="28" r="6" fill="#F97316" />
        <path d="M26.5 28l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-lg font-bold tracking-tight text-foreground">
          Resume<span className="text-primary">Match</span>
        </span>
      )}
    </div>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#059669" : score >= 60 ? "#F97316" : "#EF4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}18`, color }}>
      <span className="size-1.5 rounded-full" style={{ background: color }} />{label}
    </span>
  );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let cur = 0;
    const t = setInterval(() => { cur += 2; setDisplayed(Math.min(cur, score)); if (cur >= score) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, [score]);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#059669" : score >= 60 ? "#F97316" : "#EF4444";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (displayed / 100) * circ}
          style={{ transition: "stroke-dashoffset 0.1s linear" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color, fontSize: size * 0.22 }}>{displayed}</span>
        <span className="text-xs text-muted-foreground mt-0.5">ATS Score</span>
      </div>
    </div>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!user) nav("/login", { replace: true }); }, [user]);
  if (!user) return null;
  return <>{children}</>;
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppShell({ children }: { children: React.ReactNode }) {
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
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0", collapsed && !onClose && "justify-center")}>
        {collapsed && !onClose ? <Logo showText={false} size={28} /> : <Logo />}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              isActive ? "bg-primary/15 text-primary" : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-white/5")}>
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
        <header className="h-16 border-b border-border bg-background/90 backdrop-blur-sm flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
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
            <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer" onClick={() => nav("/profile")}>
              <span className="text-xs font-black text-primary">{user?.name.charAt(0)}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="min-h-full">
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage() {
  const nav = useNavigate();
  const { user } = useAuth();

  const features = [
    { icon: Target, title: "ATS Score Analysis", desc: "Precise compatibility score based on 40+ ATS criteria.", color: "#059669" },
    { icon: Hash, title: "Keyword Intelligence", desc: "Identify every keyword your resume is missing.", color: "#F97316" },
    { icon: Layers, title: "Skill Gap Detection", desc: "Visualize technical and soft skill gaps instantly.", color: "#3B82F6" },
    { icon: Lightbulb, title: "Smart Suggestions", desc: "Actionable improvement tips tailored to the role.", color: "#A855F7" },
    { icon: BarChart2, title: "Analytics Dashboard", desc: "Track ATS score progression across applications.", color: "#EC4899" },
    { icon: Download, title: "PDF Report Export", desc: "Download a detailed PDF report for each analysis.", color: "#059669" },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b border-border bg-background/85 backdrop-blur-md">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={() => nav("/dashboard")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
              Dashboard <ArrowRight className="size-3.5" />
            </button>
          ) : (
            <>
              <button onClick={() => nav("/login")} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Log in</button>
              <button onClick={() => nav("/register")} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/6 to-transparent" />
          <div className="absolute -top-48 -right-32 w-[500px] h-[500px] rounded-full bg-primary/7 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 grid md:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mb-6">
              <Sparkles className="size-3" /> AI-Powered ATS Optimizer
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-foreground leading-[1.05] mb-6">
              Beat the ATS.<br /><span className="text-primary">Land the interview.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Upload your resume and job description. ResumeMatch gives you a precise ATS score with keyword gaps and actionable fixes in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => nav(user ? "/analyzer" : "/register")}
                className="group flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Analyze My Resume <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => nav("/login")}
                className="flex items-center gap-2 px-6 py-3.5 border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">
                <Eye className="size-4" /> See Sample Report
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-5 mt-8">
              {["No credit card", "Free plan available", "Instant results"].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Check className="size-3.5 text-primary" /> {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preview card */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center">
            <div className="relative">
              <div className="w-80 bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground">Analyzing for</p>
                    <p className="text-sm font-bold text-foreground">Senior Frontend Engineer</p>
                    <p className="text-xs text-muted-foreground">Stripe · San Francisco</p>
                  </div>
                  <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Briefcase className="size-4 text-primary" />
                  </div>
                </div>
                <div className="flex justify-center my-2">
                  <ScoreRing score={84} size={140} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[{l:"Keywords",v:88},{l:"Structure",v:92},{l:"Completeness",v:76},{l:"Readability",v:80}].map(({l,v}) => (
                    <div key={l} className="bg-muted/40 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">{l}</p>
                      <p className="text-sm font-black text-foreground mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{v}%</p>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -left-20 top-10 bg-card border border-primary/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-primary" />
                  <div><p className="text-xs font-bold text-foreground">React ✓</p><p className="text-xs text-muted-foreground">Matched</p></div>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.6 }}
                className="absolute -right-16 bottom-16 bg-card border border-accent/25 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-accent" />
                  <div><p className="text-xs font-bold text-foreground">Docker</p><p className="text-xs text-muted-foreground">Missing</p></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{v:"94%",l:"Interview Rate",s:"for 80+ score resumes"},{v:"3.2M+",l:"Resumes Analyzed",s:"and counting"},{v:"47K+",l:"Jobs Matched",s:"across industries"},{v:"4.9★",l:"User Rating",s:"12,000+ reviews"}].map(({v,l,s},i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} viewport={{ once: true }} className="text-center">
              <p className="text-3xl font-black text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{v}</p>
              <p className="text-sm font-bold text-foreground mt-1">{l}</p>
              <p className="text-xs text-muted-foreground">{s}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-4xl font-black text-foreground mb-4">Everything you need to win</h2>
          <p className="text-muted-foreground max-w-lg">A comprehensive ATS optimization toolkit for serious job seekers.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.07 }}
              viewport={{ once: true }} whileHover={{ y: -4 }}
              className="group relative bg-card border border-border rounded-2xl p-6 overflow-hidden cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}35`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 0% 0%, ${color}07, transparent 60%)` }} />
              <div className="size-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                <Icon className="size-5" style={{ color }} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-card/25 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Process</p>
            <h2 className="text-4xl font-black text-foreground">Three steps to a stronger resume</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { n: "01", t: "Upload Resume", d: "Drop your PDF or DOCX. We parse and extract all content automatically.", i: Upload },
              { n: "02", t: "Paste Job Description", d: "Copy the JD from any job board. We analyze every requirement.", i: FileText },
              { n: "03", t: "Get Your Report", d: "Receive a full ATS score, keyword gaps, and prioritized suggestions.", i: BarChart2 },
            ].map(({ n, t, d, i: Icon }, idx) => (
              <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx*0.15 }} viewport={{ once: true }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <span className="text-5xl font-black text-white/8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{n}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-primary p-12 md:p-16 text-center">
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: "radial-gradient(circle, white 0.5px, transparent 0.5px)",
            backgroundSize: "36px 36px",
          }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Start matching today.</h2>
            <p className="text-white/65 text-lg mb-8 max-w-lg mx-auto">Join thousands of job seekers who landed their dream roles with ResumeMatch.</p>
            <button onClick={() => nav(user ? "/analyzer" : "/register")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-black text-sm hover:bg-white/92 transition-colors">
              Get Started Free <ArrowRight className="size-4" />
            </button>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-muted-foreground">© 2025 ResumeMatch. Built for ambitious job seekers.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            {["Privacy","Terms","Contact"].map(t => <a key={t} href="#" className="hover:text-foreground transition-colors">{t}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return;
    setLoading(true);
    const ok = mode === "login" ? await login(form.email, form.password) : await register(form.name, form.email, form.password);
    setLoading(false);
    if (ok) { toast.success(mode === "login" ? "Welcome back!" : "Account created!"); nav("/dashboard"); }
    else toast.error("Try any email + 6+ character password to demo.");
  };

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-12 border-r border-border bg-gradient-to-br from-primary/12 via-background to-background">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(5,150,105,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(5,150,105,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-xs text-center">
          <div className="mb-10"><Logo size={44} /></div>
          <div className="bg-card/70 border border-border rounded-3xl p-8 mb-8 backdrop-blur-sm">
            <ScoreRing score={91} size={160} />
            <p className="text-sm text-muted-foreground mt-4">Average score improvement after using ResumeMatch</p>
          </div>
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "ResumeMatch increased my callback rate from 8% to 43% in two weeks."
          </p>
          <p className="text-xs text-primary font-bold mt-2">— Sarah K., SWE at Google</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>
          <h1 className="text-2xl font-black text-foreground mb-1">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground mb-8">{mode === "login" ? "Sign in to your ResumeMatch account." : "Start optimizing your resume for free."}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className={cn("w-full bg-input-background border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all", errors.name ? "border-destructive" : "border-border")}
                    placeholder="Jordan Rivera" />
                </div>
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className={cn("w-full bg-input-background border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all", errors.email ? "border-destructive" : "border-border")}
                  placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  className={cn("w-full bg-input-background border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all", errors.password ? "border-destructive" : "border-border")}
                  placeholder="Minimum 6 characters" />
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-black text-sm hover:bg-primary/90 transition-all disabled:opacity-60 mt-2">
              {loading && <RefreshCw className="size-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => nav(mode === "login" ? "/register" : "/login")} className="text-primary font-bold hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage() {
  const { user } = useAuth();
  const { analyses } = useAnalyses();
  const nav = useNavigate();
  const avg = analyses.length > 0 ? Math.round(analyses.reduce((s,a) => s + a.atsScore, 0) / analyses.length) : 0;
  const best = analyses.length > 0 ? Math.max(...analyses.map(a => a.atsScore)) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const radarData = [
    {subject:"Keywords",A:analyses[0]?.keywordScore??0},
    {subject:"Structure",A:analyses[0]?.structureScore??0},
    {subject:"Complete",A:analyses[0]?.completenessScore??0},
    {subject:"Readable",A:analyses[0]?.readabilityScore??0},
    {subject:"Skills",A:78},
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Good {greeting}, <span className="text-primary">{user?.name.split(" ")[0]}</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your resume performance overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {l:"Avg ATS Score",v:`${avg}`,u:"/100",icon:Target,c:"#059669"},
          {l:"Best Score",v:`${best}`,u:"/100",icon:Award,c:"#F97316"},
          {l:"Total Analyses",v:`${analyses.length}`,u:"",icon:FileText,c:"#3B82F6"},
          {l:"Strong Matches",v:`${analyses.filter(a=>a.atsScore>=75).length}`,u:"",icon:Briefcase,c:"#A855F7"},
        ].map(({l,v,u,icon:Icon,c}) => (
          <motion.div key={l} whileHover={{ y: -2 }} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-semibold">{l}</p>
              <div className="size-8 rounded-xl flex items-center justify-center" style={{ background: `${c}18` }}>
                <Icon className="size-4" style={{ color: c }} />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {v}<span className="text-sm text-muted-foreground font-normal">{u}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-sm font-bold text-foreground">Score Trend</h2><p className="text-xs text-muted-foreground">Last 6 months</p></div>
            <TrendingUp className="size-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={DASHBOARD_TREND}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.28}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill:"#666D66", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40,100]} tick={{ fill:"#666D66", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:"#161A1A", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, fontSize:12, color:"#EFF1EE" }} />
              <Area type="monotone" dataKey="score" stroke="#059669" strokeWidth={2.5} fill="url(#sg)" dot={{ fill:"#059669", r:4, strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-bold text-foreground mb-1">Latest Analysis</h2>
          <p className="text-xs text-muted-foreground mb-3">Score breakdown</p>
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill:"#666D66", fontSize:10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.18} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Recent Analyses</h2>
            <button onClick={() => nav("/history")} className="text-xs text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-1">
            {analyses.slice(0,3).map(a => (
              <motion.div key={a.id} whileHover={{ x: 2 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/4 cursor-pointer transition-colors"
                onClick={() => nav(`/results/${a.id}`)}>
                <div className="size-10 rounded-xl bg-primary/12 flex items-center justify-center flex-shrink-0">
                  <FileText className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{a.jobTitle}</p>
                  <p className="text-xs text-muted-foreground">{a.company} · {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black" style={{ fontFamily:"'JetBrains Mono',monospace", color: a.atsScore>=80?"#059669":a.atsScore>=60?"#F97316":"#EF4444" }}>
                    {a.atsScore}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
              <Zap className="size-6 text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground mb-2">Ready for your next application?</h2>
            <p className="text-sm text-muted-foreground">Upload a new resume and job description for an instant ATS score.</p>
          </div>
          <button onClick={() => nav("/analyzer")}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            <Plus className="size-4" /> New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Analyzer Page ────────────────────────────────────────────────────────────
function AnalyzerPage() {
  const nav = useNavigate();
  const { addAnalysis } = useAnalyses();
  const [step, setStep] = useState<"upload"|"jd"|"running"|"done">("upload");
  const [resumeFile, setResumeFile] = useState<File|null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setResumeFile(file);
    if (file.type === "text/plain") {
      const r = new FileReader(); r.onload = e => setResumeText((e.target?.result as string) || ""); r.readAsText(file);
    } else {
      setResumeText(`Experienced software engineer. Skills: React TypeScript Node.js AWS CI/CD GraphQL Jest Webpack Agile REST API Git Linux. Work Experience Summary Education Skills sections. Communication Leadership Problem Solving Team Collaboration.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const runAnalysis = async () => {
    if (!jobTitle.trim() || !jobDesc.trim()) { toast.error("Please fill in the job title and description"); return; }
    setStep("running"); setProgress(0);
    for (const p of [10,25,45,62,78,90,97,100]) { await new Promise(r => setTimeout(r, 380)); setProgress(p); }
    const result = runAtsAnalysis(resumeText || "React TypeScript Node.js AWS Skills Experience Education Summary", jobDesc, jobTitle, company || "Company", resumeFile?.name || "resume.pdf");
    addAnalysis(result);
    setStep("done");
    setTimeout(() => nav(`/results/${result.id}`), 600);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Resume Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload your resume and paste the job description.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {[{k:"upload",l:"Upload Resume",n:1},{k:"jd",l:"Job Description",n:2}].map(({k,l,n},i) => {
          const done = (k==="upload"&&["jd","running","done"].includes(step))||(k==="jd"&&["running","done"].includes(step));
          const cur = step===k;
          return (
            <React.Fragment key={k}>
              {i>0 && <div className={cn("flex-1 h-px transition-colors", done?"bg-primary/40":"bg-border")} />}
              <div className="flex items-center gap-2">
                <div className={cn("size-7 rounded-full flex items-center justify-center text-xs font-black transition-all",
                  done?"bg-primary text-white":cur?"bg-primary/20 text-primary border border-primary/40":"bg-muted text-muted-foreground")}>
                  {done ? <Check className="size-3.5" /> : n}
                </div>
                <span className={cn("text-xs font-bold hidden sm:block", cur?"text-foreground":done?"text-primary":"text-muted-foreground")}>{l}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div key="upload" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={cn("relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                dragging?"border-primary bg-primary/10":resumeFile?"border-primary/35 bg-primary/5":"border-border hover:border-primary/35 hover:bg-white/2")}>
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {resumeFile ? (
                <div>
                  <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"><FileText className="size-8 text-primary" /></div>
                  <p className="text-base font-bold text-foreground">{resumeFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{(resumeFile.size/1024).toFixed(1)} KB · Ready to analyze</p>
                  <button onClick={e => { e.stopPropagation(); setResumeFile(null); setResumeText(""); }}
                    className="mt-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
                    <X className="size-3" /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4"><Upload className="size-8 text-muted-foreground" /></div>
                  <p className="text-base font-bold text-foreground">Drop your resume here</p>
                  <p className="text-sm text-muted-foreground mt-1">or <span className="text-primary">browse files</span></p>
                  <p className="text-xs text-muted-foreground mt-3">PDF, DOCX, TXT · Max 10MB</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">or paste resume text</span><div className="flex-1 h-px bg-border" />
              </div>
              <textarea value={resumeText.startsWith("Experienced software") ? "" : resumeText} onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-40 bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => {
                if (!resumeFile && !resumeText.trim()) { toast.error("Please upload a resume or paste resume text"); return; }
                if (!resumeText.trim()) setResumeText("React TypeScript Node.js AWS Experience Education Skills Summary");
                setStep("jd");
              }} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                Continue <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "jd" && (
          <motion.div key="jd" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Job Title *</label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Company</label>
                <input value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Stripe" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Job Description *</label>
              <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here. Include requirements, responsibilities, and preferred qualifications for best results..."
                className="w-full h-64 bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              <p className="text-xs text-muted-foreground mt-1">{jobDesc.length} characters</p>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep("upload")} className="flex items-center gap-2 px-5 py-3 border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
                <ChevronLeft className="size-4" /> Back
              </button>
              <button onClick={runAnalysis} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                <Zap className="size-4" /> Run Analysis
              </button>
            </div>
          </motion.div>
        )}

        {(step==="running"||step==="done") && (
          <motion.div key="running" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col items-center py-16">
            <div className="relative size-32 mb-8">
              <svg width="128" height="128" className="-rotate-90">
                <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="64" cy="64" r="54" fill="none" stroke="#059669" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*54}`}
                  strokeDashoffset={`${2*Math.PI*54*(1-progress/100)}`}
                  style={{ transition:"stroke-dashoffset 0.4s ease" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-foreground" style={{ fontFamily:"'JetBrains Mono',monospace" }}>{progress}%</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-foreground mb-6">Analyzing your resume…</h2>
            <div className="space-y-2.5 text-center">
              {[{at:0,l:"Extracting resume content"},{at:25,l:"Parsing job description keywords"},{at:50,l:"Running ATS compatibility checks"},{at:75,l:"Analyzing skill gaps"},{at:95,l:"Generating detailed report"}].map(({at,l}) => (
                <motion.div key={l} animate={{ opacity: progress>=at?1:0.2 }} className="flex items-center gap-2 justify-center">
                  {progress>at+10?<CheckCircle className="size-3.5 text-primary"/>:<div className="size-3.5 rounded-full border border-border"/>}
                  <span className="text-sm text-muted-foreground">{l}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────
function ResultsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { analyses } = useAnalyses();
  const [tab, setTab] = useState<"overview"|"keywords"|"skills"|"suggestions">("overview");
  const a = analyses.find(x => x.id === id) || analyses[0];

  if (!a) return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
      <FileText className="size-12 text-muted-foreground mb-4" />
      <h2 className="text-lg font-bold text-foreground mb-2">Analysis not found</h2>
      <button onClick={() => nav("/history")} className="text-sm text-primary hover:underline">Go to History</button>
    </div>
  );

  const breakdown = [
    {l:"Keyword Match",v:a.keywordScore,c:"#059669"},
    {l:"Structure",v:a.structureScore,c:"#3B82F6"},
    {l:"Completeness",v:a.completenessScore,c:"#A855F7"},
    {l:"Readability",v:a.readabilityScore,c:"#F97316"},
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <button onClick={() => nav(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="size-4" /> Back
      </button>

      {/* Hero */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <ScoreBadge score={a.atsScore} />
            <h1 className="text-2xl font-black text-foreground mt-3">{a.jobTitle}</h1>
            <p className="text-muted-foreground text-sm mt-1">{a.company} · {new Date(a.createdAt).toLocaleDateString()}</p>
            <div className="flex flex-wrap gap-3 mt-5">
              {[{l:"words",v:a.wordCount},{l:"yrs experience",v:a.experienceYears},{l:"education",v:a.educationLevel}].map(({l,v}) => (
                <div key={l} className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-1.5">
                  <span className="font-bold text-foreground">{v}</span> {l}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <ScoreRing score={a.atsScore} size={160} />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {breakdown.map(({l,v,c}) => (
          <div key={l} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">{l}</p>
            <p className="text-xl font-black mb-2" style={{ fontFamily:"'JetBrains Mono',monospace", color:c }}>{v}%</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width:0 }} animate={{ width:`${v}%` }} transition={{ duration:1, delay:0.3 }}
                className="h-full rounded-full" style={{ background:c }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/25 p-1 rounded-xl mb-6 w-fit">
        {(["overview","keywords","skills","suggestions"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all",
              tab===t?"bg-card text-foreground shadow-sm":"text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab==="overview" && (
          <motion.div key="ov" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Layers className="size-4 text-primary"/>Resume Sections</h2>
              <div className="space-y-2.5">
                {a.sections.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    {s.present?<CheckCircle className="size-4 text-primary flex-shrink-0"/>:<XCircle className="size-4 text-destructive flex-shrink-0"/>}
                    <span className="text-sm text-foreground flex-1">{s.name}</span>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                      s.quality==="good"?"bg-primary/15 text-primary":s.quality==="fair"?"bg-accent/15 text-accent":"bg-destructive/15 text-destructive")}>
                      {s.quality}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/8 border border-primary/18 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2"><CheckCircle className="size-4"/>Strengths</h2>
                <ul className="space-y-2">{a.strengths.map((s,i) => <li key={i} className="flex items-start gap-2 text-sm text-foreground/80"><div className="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0"/>{s}</li>)}</ul>
              </div>
              <div className="bg-destructive/8 border border-destructive/18 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-destructive mb-3 flex items-center gap-2"><AlertCircle className="size-4"/>Areas to Improve</h2>
                <ul className="space-y-2">{a.weaknesses.map((w,i) => <li key={i} className="flex items-start gap-2 text-sm text-foreground/80"><div className="size-1.5 rounded-full bg-destructive mt-2 flex-shrink-0"/>{w}</li>)}</ul>
              </div>
            </div>
          </motion.div>
        )}

        {tab==="keywords" && (
          <motion.div key="kw" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><CheckCircle className="size-4"/>Matched ({a.matchedKeywords.length})</h2>
              <div className="flex flex-wrap gap-2">
                {a.matchedKeywords.map(kw => <span key={kw} className="px-3 py-1 bg-primary/14 text-primary text-xs font-bold rounded-full border border-primary/18">{kw}</span>)}
                {a.matchedKeywords.length===0&&<p className="text-sm text-muted-foreground">No matched keywords detected.</p>}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-bold text-destructive mb-4 flex items-center gap-2"><XCircle className="size-4"/>Missing ({a.missingKeywords.length})</h2>
              <div className="flex flex-wrap gap-2">
                {a.missingKeywords.map(kw => <span key={kw} className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded-full border border-destructive/18">{kw}</span>)}
                {a.missingKeywords.length===0&&<p className="text-sm text-muted-foreground">No missing critical keywords!</p>}
              </div>
            </div>
            <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-bold text-foreground mb-4">Coverage Summary</h2>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={[{name:"Matched",value:a.matchedKeywords.length},{name:"Missing",value:a.missingKeywords.length}]} layout="vertical">
                  <XAxis type="number" tick={{fill:"#666D66",fontSize:11}} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{fill:"#EFF1EE",fontSize:11}} axisLine={false} tickLine={false} width={65} />
                  <Tooltip contentStyle={{background:"#161A1A",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,fontSize:12,color:"#EFF1EE"}} />
                  <Bar dataKey="value" radius={[0,6,6,0]} fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {tab==="skills" && (
          <motion.div key="sk" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Code className="size-4 text-primary"/>Technical Skills</h2>
              {a.technicalSkills.length>0?(
                <div className="space-y-2.5">
                  {a.technicalSkills.map(s => (
                    <div key={s.name} className="flex items-center gap-3">
                      {s.matched?<CheckCircle className="size-4 text-primary flex-shrink-0"/>:<XCircle className="size-4 text-muted-foreground/50 flex-shrink-0"/>}
                      <span className={cn("text-sm flex-1",s.matched?"text-foreground":"text-muted-foreground")}>{s.name}</span>
                      <span className={cn("text-xs font-semibold",s.matched?"text-primary":"text-muted-foreground")}>{s.matched?"Present":"Missing"}</span>
                    </div>
                  ))}
                </div>
              ):<p className="text-sm text-muted-foreground">No specific technical skills detected in JD.</p>}
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Users className="size-4 text-accent"/>Soft Skills</h2>
              <div className="space-y-2.5">
                {a.softSkills.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    {s.matched?<CheckCircle className="size-4 text-primary flex-shrink-0"/>:<XCircle className="size-4 text-muted-foreground/50 flex-shrink-0"/>}
                    <span className={cn("text-sm flex-1",s.matched?"text-foreground":"text-muted-foreground")}>{s.name}</span>
                    <span className={cn("text-xs font-semibold",s.matched?"text-primary":"text-muted-foreground")}>{s.matched?"Present":"Missing"}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab==="suggestions" && (
          <motion.div key="sg" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <div className="space-y-3">
              {a.suggestions.map((s,i) => (
                <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
                  className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                  <div className="size-8 rounded-lg bg-accent/14 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="size-4 text-accent" />
                  </div>
                  <p className="text-sm text-foreground flex-1">{s}</p>
                  <span className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-2 py-1 flex-shrink-0">#{i+1}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => toast.success("Report download started! (demo)")}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                <Download className="size-4" /> Download PDF Report
              </button>
              <button onClick={() => nav("/analyzer")}
                className="flex items-center gap-2 px-5 py-3 border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
                <RefreshCw className="size-4" /> New Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── History Page ─────────────────────────────────────────────────────────────
function HistoryPage() {
  const nav = useNavigate();
  const { analyses, deleteAnalysis } = useAnalyses();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all"|"high"|"medium"|"low">("all");

  const filtered = analyses.filter(a => {
    const ms = a.jobTitle.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="all"||(filter==="high"&&a.atsScore>=80)||(filter==="medium"&&a.atsScore>=60&&a.atsScore<80)||(filter==="low"&&a.atsScore<60);
    return ms&&mf;
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground">Analysis History</h1>
          <p className="text-sm text-muted-foreground mt-1">{analyses.length} analyses total</p>
        </div>
        <button onClick={() => nav("/analyzer")}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
          <Plus className="size-4" /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by job title or company…"
            className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="flex gap-1.5">
          {(["all","high","medium","low"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                filter===f?"bg-primary text-white":"bg-card border border-border text-muted-foreground hover:text-foreground")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {filtered.length===0 ? (
          <div className="p-16 text-center">
            <FileText className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-bold text-foreground">No analyses found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search or run a new analysis</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Role","Company","Date","Score","Status",""].map(h => (
                    <th key={h} className={cn("text-left px-5 py-4 text-xs font-bold text-muted-foreground", h==="Date"&&"hidden sm:table-cell", h===""&&"w-20")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a,i) => (
                  <motion.tr key={a.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                    className="border-b border-border last:border-0 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-foreground">{a.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{a.resumeFileName}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{a.company}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground hidden sm:table-cell">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className="text-xl font-black" style={{ fontFamily:"'JetBrains Mono',monospace", color:a.atsScore>=80?"#059669":a.atsScore>=60?"#F97316":"#EF4444" }}>
                        {a.atsScore}
                      </span>
                    </td>
                    <td className="px-5 py-4"><ScoreBadge score={a.atsScore} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => nav(`/results/${a.id}`)}
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors">
                          <Eye className="size-4" />
                        </button>
                        <button onClick={() => { deleteAnalysis(a.id); toast.success("Deleted"); }}
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name||"", email: user?.email||"", phone:"+1 (555) 234-5678", location:"San Francisco, CA", website:"jordanrivera.dev" });
  const [notifs, setNotifs] = useState({ email: true, digest: false, alerts: true });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-black text-primary">{user?.name.charAt(0)}</span>
            </div>
            <h2 className="text-base font-black text-foreground">{form.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{form.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-black">
              <Star className="size-3" /> {user?.plan==="pro"?"Pro Plan":"Free Plan"}
            </div>
          </div>
          {user?.plan==="free" && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2"><Zap className="size-4 text-accent"/><p className="text-sm font-bold text-foreground">Upgrade to Pro</p></div>
              <p className="text-xs text-muted-foreground mb-3">Unlimited analyses, PDF reports, priority support.</p>
              <button className="w-full py-2.5 bg-accent text-white rounded-xl text-xs font-black hover:bg-accent/90 transition-colors">Upgrade — $12/mo</button>
            </div>
          )}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-xs font-bold text-foreground mb-3">Account Info</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Calendar className="size-3.5"/>Joined {new Date(user?.joinedAt||"2024-01-15").toLocaleDateString()}</div>
              <div className="flex items-center gap-2"><Shield className="size-3.5"/>Security enabled</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-foreground">Personal Information</h2>
              <button onClick={() => { if (editing) { toast.success("Profile updated!"); } setEditing(e => !e); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-border hover:bg-white/5 text-foreground transition-colors">
                {editing ? <><Save className="size-3.5"/>Save</> : <><Edit3 className="size-3.5"/>Edit</>}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {([["Full Name","name",User],["Email","email",Mail],["Phone","phone",Phone],["Location","location",MapPin],["Website","website",Globe]] as [string,keyof typeof form,React.FC<{className?:string}>][]).map(([label,key,Icon]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">{label}</label>
                  {editing ? (
                    <input value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                      className="w-full bg-input-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="size-3.5 text-muted-foreground flex-shrink-0" />{form[key]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-bold text-foreground mb-4">Notifications</h2>
            <div className="space-y-4">
              {([["email","Email notifications for new analyses"],["digest","Weekly performance digest"],["alerts","Job match alerts"]] as [keyof typeof notifs,string][]).map(([key,label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{label}</span>
                  <button onClick={() => setNotifs(n => ({...n,[key]:!n[key]}))}
                    className={cn("relative w-10 h-5 rounded-full transition-colors flex-shrink-0", notifs[key]?"bg-primary":"bg-switch-background")}>
                    <span className={cn("absolute top-0.5 size-4 bg-white rounded-full shadow transition-transform", notifs[key]?"translate-x-5.5":"translate-x-0.5")} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-destructive/8 border border-destructive/18 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-destructive mb-2">Danger Zone</h2>
            <p className="text-xs text-muted-foreground mb-3">These actions are irreversible. Please be careful.</p>
            <button onClick={() => { logout(); nav("/"); toast.success("Logged out successfully"); }}
              className="flex items-center gap-2 px-4 py-2 border border-destructive/35 text-destructive text-xs font-bold rounded-xl hover:bg-destructive/10 transition-colors">
              <LogOut className="size-3.5" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(() => {
    try { const s = localStorage.getItem("rm_analyses"); return s ? JSON.parse(s) : MOCK_ANALYSES; } catch { return MOCK_ANALYSES; }
  });
  const addAnalysis = useCallback((a: AnalysisResult) => {
    setAnalyses(prev => { const next = [a, ...prev]; localStorage.setItem("rm_analyses", JSON.stringify(next)); return next; });
  }, []);
  const deleteAnalysis = useCallback((id: string) => {
    setAnalyses(prev => { const next = prev.filter(a => a.id !== id); localStorage.setItem("rm_analyses", JSON.stringify(next)); return next; });
  }, []);

  return (
    <AuthProvider>
      <AnalysesContext.Provider value={{ analyses, addAnalysis, deleteAnalysis }}>
        <BrowserRouter>
          <AppInner />
          <Toaster position="top-right" theme="dark" toastOptions={{ style:{ background:"#161A1A", border:"1px solid rgba(255,255,255,0.08)", color:"#EFF1EE" } }} />
        </BrowserRouter>
      </AnalysesContext.Provider>
    </AuthProvider>
  );
}

function AppInner() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
        <Route path="/analyzer" element={<ProtectedRoute><AppShell><AnalyzerPage /></AppShell></ProtectedRoute>} />
        <Route path="/results/:id" element={<ProtectedRoute><AppShell><ResultsPage /></AppShell></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><AppShell><HistoryPage /></AppShell></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}
