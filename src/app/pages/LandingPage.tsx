import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Target, Hash, Layers, Lightbulb, BarChart2, Download, 
  ArrowRight, Check, X, Star, Zap, Globe, Mail, Menu
} from 'lucide-react';
import { Logo } from '../components/shared/Logo';
import { ParticleField } from '../components/shared/ParticleField';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { ScrollToTop } from '../components/shared/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import { cn } from '../types';

const FEATURES = [
  {
    icon: Target,
    title: "ATS Score Analysis",
    description: "Get a detailed compatibility score based on 40+ ATS criteria and algorithms used by Fortune 500 recruiters.",
    color: "text-emerald-500",
    borderColor: "hover:border-emerald-500/30"
  },
  {
    icon: Hash,
    title: "Keyword Intelligence",
    description: "Identify high-impact keywords, skills, and industry terminology missing from your resume.",
    color: "text-orange-500",
    borderColor: "hover:border-orange-500/30"
  },
  {
    icon: Layers,
    title: "Skill Gap Detection",
    description: "Visualize both technical and soft skill gaps side-by-side with clear actionable guidance.",
    color: "text-blue-500",
    borderColor: "hover:border-blue-500/30"
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description: "Actionable, prioritized bullet-point improvements to tailor your resume for any specific job role.",
    color: "text-purple-500",
    borderColor: "hover:border-purple-500/30"
  },
  {
    icon: BarChart2,
    title: "Analytics Dashboard",
    description: "Track your score progression and application match rates over time in one unified view.",
    color: "text-pink-500",
    borderColor: "hover:border-pink-500/30"
  },
  {
    icon: Download,
    title: "PDF Report Export",
    description: "Export clean, printable PDF reports with comprehensive breakdown metrics for your records.",
    color: "text-emerald-500",
    borderColor: "hover:border-emerald-500/30"
  }
];

const TESTIMONIALS = [
  {
    quote: "ResumeMatch boosted my callback rate from 5% to 38%. The keyword analysis is incredibly precise.",
    name: "Sarah Kim",
    role: "SWE at Google",
    color: "bg-emerald-500"
  },
  {
    quote: "I landed 3 interviews in my first week after optimizing my resume with the ATS suggestions.",
    name: "Marcus Chen",
    role: "PM at Meta",
    color: "bg-blue-500"
  },
  {
    quote: "The skill gap detection saved me hours of manual comparison. Now I tailor each resume in minutes.",
    name: "Priya Patel",
    role: "Data Engineer at Stripe",
    color: "bg-purple-500"
  }
];

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      <ScrollToTop />
      
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/85 backdrop-blur-xl border-border py-4" 
          : "bg-transparent border-transparent py-5"
      )}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20 flex items-center gap-1.5 text-sm"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-5 space-y-4"
            >
              <div className="flex flex-col space-y-3 text-sm font-medium">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground py-1"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground py-1"
                >
                  How It Works
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground py-1"
                >
                  Pricing
                </a>
              </div>
              <div className="pt-3 border-t border-border flex flex-col gap-2.5">
                {user ? (
                  <button 
                    onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                    className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold text-center"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                      className="w-full py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold text-center"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                      className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold text-center"
                    >
                      Get Started Free
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 min-h-screen">
        <div className="absolute inset-0 z-0">
          <ParticleField />
        </div>
        
        <div className="flex-1 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/25">
              <Zap className="w-3.5 h-3.5" />
              <span>AI-Powered ATS Optimizer</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.08] mb-6">
              Match your resume to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">dream job</span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Upload your resume and the job description. Our AI analyzes the match, identifies missing keywords, and gives you actionable feedback to beat the ATS.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3.5">
              <button 
                onClick={handleGetStarted}
                className="px-7 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm"
              >
                Analyze Your Resume <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="#how-it-works"
                className="px-7 py-3.5 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-card/80 transition-colors flex items-center justify-center text-sm"
              >
                See How It Works
              </a>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center overflow-hidden text-[10px] font-bold text-primary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>Joined by <strong className="text-foreground">12,000+</strong> ambitious job seekers</div>
            </div>
          </motion.div>
        </div>
        
        <div className="flex-1 relative z-10 w-full max-w-md mx-auto md:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Aurora effect */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-3xl blur-2xl opacity-50 animate-pulse" />
            
            <div className="relative bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-foreground">Senior Frontend Engineer</h3>
                  <p className="text-xs text-muted-foreground">Stripe • San Francisco</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-0.5">ATS Match</div>
                  <div className="text-2xl font-black font-mono text-primary">87%</div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-foreground">Keywords Detected</span>
                    <span className="text-xs font-mono text-primary font-bold">14/18 Found</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">React</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">TypeScript</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-mono">GraphQL</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">Next.js</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">CI/CD</span>
                  </div>
                </div>
                
                <div className="p-3.5 rounded-xl bg-background/80 border border-border">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 rounded-lg bg-accent/15 text-accent flex-shrink-0">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-0.5">Impact Suggestion</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Quantify achievements: "Architected 20+ reusable React components, accelerating feature releases by 30% across 3 teams."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
              className="absolute -right-4 top-1/4 bg-card/90 backdrop-blur-md border border-primary/30 rounded-xl p-2.5 shadow-xl flex items-center gap-2.5"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Skill Matched</div>
                <div className="text-xs font-bold font-mono">React.js ✓</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -left-4 bottom-1/4 bg-card/90 backdrop-blur-md border border-destructive/30 rounded-xl p-2.5 shadow-xl flex items-center gap-2.5"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 }}
            >
              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                <X className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Missing Keyword</div>
                <div className="text-xs font-bold font-mono">Docker</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
            <div className="text-center px-4 pt-4 sm:pt-0">
              <div className="text-3xl font-black text-foreground font-mono mb-1 flex justify-center items-center">
                <AnimatedCounter value={94} />%
              </div>
              <div className="text-xs font-bold text-foreground mb-0.5">Interview Rate</div>
              <div className="text-[11px] text-muted-foreground">for 80+ score resumes</div>
            </div>
            <div className="text-center px-4 pt-4 sm:pt-0">
              <div className="text-3xl font-black text-foreground font-mono mb-1 flex justify-center items-center">
                <AnimatedCounter value={3.2} decimals={1} />M+
              </div>
              <div className="text-xs font-bold text-foreground mb-0.5">Resumes Analyzed</div>
              <div className="text-[11px] text-muted-foreground">and counting</div>
            </div>
            <div className="text-center px-4 pt-4 sm:pt-0">
              <div className="text-3xl font-black text-foreground font-mono mb-1 flex justify-center items-center">
                <AnimatedCounter value={47} />K+
              </div>
              <div className="text-xs font-bold text-foreground mb-0.5">Jobs Matched</div>
              <div className="text-[11px] text-muted-foreground">across industries</div>
            </div>
            <div className="text-center px-4 pt-4 sm:pt-0">
              <div className="text-3xl font-black text-foreground font-mono mb-1 flex justify-center items-center">
                <AnimatedCounter value={4.9} decimals={1} />★
              </div>
              <div className="text-xs font-bold text-foreground mb-0.5">User Rating</div>
              <div className="text-[11px] text-muted-foreground">12,000+ reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Features</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">Everything you need to land the interview</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Our comprehensive analysis tools give you the exact insights you need to tailor your resume for any role.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className={cn(
                  "group p-6 rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-lg relative overflow-hidden",
                  feature.borderColor
                )}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 transition-opacity duration-500",
                  hoveredFeature === idx ? "opacity-5" : "",
                  feature.color.replace('text-', 'bg-')
                )} />
                <div className={cn("w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mb-4", feature.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-card/30 border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Workflow</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">Three steps to your optimal resume</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Simple steps to optimize your resume and substantially boost your callback rates.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="bg-card/70 border border-border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center text-lg font-black text-primary mb-4 font-mono">1</div>
              <h3 className="text-base font-bold mb-2">Upload Resume</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Drop your PDF or DOCX file. We parse and extract content instantly.</p>
            </div>
            
            <div className="bg-card/70 border border-border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center text-lg font-black text-primary mb-4 font-mono">2</div>
              <h3 className="text-base font-bold mb-2">Paste Job Description</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Paste the requirements from any job listing to extract key ATS keywords.</p>
            </div>
            
            <div className="bg-card/70 border border-border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center text-lg font-black text-primary mb-4 font-mono">3</div>
              <h3 className="text-base font-bold mb-2">Get Actionable Report</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Receive a detailed score, missing keywords, and prioritized suggestions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Social Proof</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">Loved by job seekers</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            See how ResumeMatch is helping thousands land interviews faster.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div key={idx} className="bg-card/70 backdrop-blur-sm border border-border p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-3 text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed italic mb-6">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs", testimonial.color)}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs text-foreground">{testimonial.name}</div>
                  <div className="text-[11px] text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 md:px-12 bg-card/30 border-y border-border relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Plans</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">Simple, transparent pricing</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Choose the plan that best fits your job search needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card border border-border rounded-3xl p-8 flex flex-col">
              <h3 className="text-lg font-bold text-foreground mb-1">Free</h3>
              <div className="text-3xl font-black text-foreground mb-4 font-mono">
                $0<span className="text-sm text-muted-foreground font-sans font-normal">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Ideal for exploring ATS optimization.</p>
              
              <ul className="space-y-3 mb-8 flex-1 text-xs">
                <li className="flex items-center gap-2.5 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>3 analyses per month</span>
                </li>
                <li className="flex items-center gap-2.5 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Basic keyword matching</span>
                </li>
                <li className="flex items-center gap-2.5 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Section detection & audit</span>
                </li>
                <li className="flex items-center gap-2.5 text-muted-foreground/60">
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>PDF report export</span>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/register')} 
                className="w-full py-3 rounded-xl border border-border text-foreground text-xs font-bold hover:bg-card/80 transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-card border border-primary shadow-lg shadow-primary/20 rounded-3xl p-8 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3.5 py-0.5 rounded-full text-xs font-bold">
                Most Popular
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Pro</h3>
              <div className="text-3xl font-black text-foreground mb-4 font-mono">
                $12<span className="text-sm text-muted-foreground font-sans font-normal">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Everything you need to land top interviews faster.</p>
              
              <ul className="space-y-3 mb-8 flex-1 text-xs">
                <li className="flex items-center gap-2.5 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex items-center gap-2.5 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Advanced AI suggestions</span>
                </li>
                <li className="flex items-center gap-2.5 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>PDF report export</span>
                </li>
                <li className="flex items-center gap-2.5 text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Skill gap radar visualization</span>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/register')} 
                className="w-full py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-1 relative overflow-hidden">
          <div className="bg-card rounded-[1.3rem] p-8 md:p-14 text-center relative z-10 border border-border">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to optimize your resume?</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of job seekers who improved their interview rate with ResumeMatch.
            </p>
            <button 
              onClick={handleGetStarted}
              className="px-8 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/25 inline-flex items-center gap-2 text-sm"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-muted-foreground">© {new Date().getFullYear()} ResumeMatch. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-foreground transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
