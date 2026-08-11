import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  CheckCircle2, ArrowRight, Upload, Zap, Lock, BarChart2,
  Check, X, Target, Hash, Layers, Lightbulb, Download,
  Star, Globe, Mail, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/shared/Logo';
import { ScoreRing } from '../components/shared/ScoreRing';
import { ScoreBadge } from '../components/shared/ScoreBadge';
import { ParticleField } from '../components/shared/ParticleField';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { ScrollToTop } from '../components/shared/ScrollToTop';
import { cn } from '../types';

const FEATURES = [
  {
    icon: Target,
    title: 'Precision Matching',
    description: 'Compare your resume against specific job descriptions to find exactly what you are missing.',
    color: 'text-emerald-500',
    borderColor: 'group-hover:border-emerald-500/50'
  },
  {
    icon: Hash,
    title: 'Keyword Analysis',
    description: 'Identify the exact keywords and phrases ATS systems are looking for in your industry.',
    color: 'text-orange-500',
    borderColor: 'group-hover:border-orange-500/50'
  },
  {
    icon: Layers,
    title: 'Section Detection',
    description: 'Automatically identify and evaluate how well each section of your resume is written.',
    color: 'text-blue-500',
    borderColor: 'group-hover:border-blue-500/50'
  },
  {
    icon: Lightbulb,
    title: 'Smart Suggestions',
    description: 'Get actionable, AI-powered recommendations to improve your bullet points and impact.',
    color: 'text-yellow-500',
    borderColor: 'group-hover:border-yellow-500/50'
  },
  {
    icon: BarChart2,
    title: 'Score Tracking',
    description: 'Monitor your resume score improvements over time with detailed visual analytics.',
    color: 'text-purple-500',
    borderColor: 'group-hover:border-purple-500/50'
  },
  {
    icon: Download,
    title: 'Export Reports',
    description: 'Download detailed PDF reports of your analysis to reference while updating your resume.',
    color: 'text-rose-500',
    borderColor: 'group-hover:border-rose-500/50'
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
      navigate('/auth?mode=register');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      <ScrollToTop />
      
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-border py-4" 
          : "bg-transparent border-transparent py-6"
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
                className="px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/auth?mode=login')}
                  className="px-5 py-2.5 rounded-full text-foreground hover:bg-card transition-colors font-medium"
                >
                  Log in
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
          
          <button className="md:hidden text-foreground">
            <Menu className="w-6 h-6" />
          </button>
        </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Resume Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Match your resume to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">dream job</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Upload your resume and the job description. Our AI analyzes the match, identifies missing keywords, and gives you actionable feedback to beat the ATS.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-emerald-600 transition-colors shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] flex items-center justify-center gap-2 text-lg"
              >
                Analyze Your Resume <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href="#how-it-works"
                className="px-8 py-4 rounded-full bg-card border border-border text-foreground font-medium hover:bg-card/80 transition-colors flex items-center justify-center text-lg"
              >
                See How It Works
              </a>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-card flex items-center justify-center overflow-hidden`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" className="w-full h-full" />
                  </div>
                ))}
              </div>
              <div>Joined by <strong className="text-foreground">12,000+</strong> job seekers</div>
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
            
            <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Frontend Developer</h3>
                  <p className="text-sm text-muted-foreground">Google • San Francisco</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Match Score</div>
                  <div className="text-3xl font-bold font-mono text-primary">87%</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Keyword Match</span>
                    <span className="text-sm font-mono text-emerald-500">14/18 Found</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">React</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">TypeScript</span>
                    <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-mono">GraphQL</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">Next.js</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">Redux</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-full bg-orange-500/20 text-orange-500">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Impact Suggestion</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Instead of "Worked on React components", try: "Architected 20+ reusable React components, reducing development time by 30% across 3 teams."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
              className="absolute -right-6 top-1/4 bg-card border border-border rounded-xl p-3 shadow-xl flex items-center gap-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Skill Matched</div>
                <div className="text-sm font-semibold font-mono">React.js</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -left-8 bottom-1/4 bg-card border border-border rounded-xl p-3 shadow-xl flex items-center gap-3"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            >
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                <X className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Missing Skill</div>
                <div className="text-sm font-semibold font-mono">Docker</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-foreground font-mono mb-2 flex justify-center items-center">
                <AnimatedCounter value={94} />%
              </div>
              <div className="text-sm font-medium text-foreground mb-1">Interview Rate</div>
              <div className="text-xs text-muted-foreground">for 80+ score resumes</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-foreground font-mono mb-2 flex justify-center items-center">
                <AnimatedCounter value={3.2} decimals={1} />M+
              </div>
              <div className="text-sm font-medium text-foreground mb-1">Resumes Analyzed</div>
              <div className="text-xs text-muted-foreground">and counting</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-foreground font-mono mb-2 flex justify-center items-center">
                <AnimatedCounter value={47} />K+
              </div>
              <div className="text-sm font-medium text-foreground mb-1">Jobs Matched</div>
              <div className="text-xs text-muted-foreground">across industries</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-foreground font-mono mb-2 flex justify-center items-center">
                <AnimatedCounter value={4.9} decimals={1} />★
              </div>
              <div className="text-sm font-medium text-foreground mb-1">User Rating</div>
              <div className="text-xs text-muted-foreground">12,000+ reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to land the interview</h2>
          <p className="text-lg text-muted-foreground">
            Our comprehensive analysis tools give you the insights you need to tailor your resume perfectly for any role.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className={cn("w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6", feature.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-card/30 border-y border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How it works</h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to optimize your resume and increase your chances of getting hired.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-card border-2 border-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-[0_0_15px_rgba(5,150,105,0.2)]">1</div>
              <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
              <p className="text-muted-foreground">Upload your current resume in PDF or DOCX format. We'll parse the content automatically.</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-card border-2 border-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-[0_0_15px_rgba(5,150,105,0.2)]">2</div>
              <h3 className="text-xl font-semibold mb-4">Paste Job Description</h3>
              <p className="text-muted-foreground">Paste the description of the job you want to apply for. We'll analyze the requirements.</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-card border-2 border-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-[0_0_15px_rgba(5,150,105,0.2)]">3</div>
              <h3 className="text-xl font-semibold mb-4">Get Actionable Feedback</h3>
              <p className="text-muted-foreground">Receive a detailed match score, missing keywords, and suggestions to improve your resume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Loved by job seekers</h2>
          <p className="text-lg text-muted-foreground">
            See how ResumeMatch is helping thousands land their dream roles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div key={idx} className="bg-card/60 backdrop-blur-sm border border-border p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed italic mb-8">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", testimonial.color)}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that best fits your job search journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card border border-border rounded-3xl p-8 flex flex-col">
              <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
              <div className="text-4xl font-bold text-foreground mb-6 font-mono">
                $0<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span>
              </div>
              <p className="text-muted-foreground mb-8">Perfect for casually exploring opportunities.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>3 analyses/month</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Basic keyword matching</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Section detection</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Community support</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground/50">
                  <X className="w-5 h-5" />
                  <span>Advanced AI suggestions</span>
                </li>
              </ul>
              <button onClick={() => navigate('/auth?mode=register')} className="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-card/80 transition-colors">
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-card border border-primary shadow-lg shadow-primary/20 rounded-3xl p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
              <div className="text-4xl font-bold text-foreground mb-6 font-mono">
                $12<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span>
              </div>
              <p className="text-muted-foreground mb-8">Everything you need to land your dream job faster.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Advanced AI suggestions</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>PDF report export</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Skill gap visualization</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Score trend analytics</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button onClick={() => navigate('/auth?mode=register')} className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-1 md:p-1.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          <div className="bg-card rounded-[1.3rem] p-8 md:p-16 text-center relative z-10 border border-border">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to optimize your resume?</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their interview chances with ResumeMatch.
            </p>
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-emerald-600 transition-colors shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] flex items-center justify-center gap-2 mx-auto text-lg animate-[pulse_2s_infinite]"
            >
              Start for free <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-muted-foreground ml-4">© {new Date().getFullYear()} ResumeMatch. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <div className="flex items-center gap-4 ml-4">
              <a href="#" className="hover:text-foreground transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
