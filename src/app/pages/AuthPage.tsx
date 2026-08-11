import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/shared/Logo';
import { ScoreRing } from '../components/shared/ScoreRing';
import { cn } from '../types';

interface AuthPageProps {
  mode?: 'login' | 'register';
}

export function AuthPage({ mode: modeProp }: AuthPageProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const queryParams = new URLSearchParams(location.search);
  const initialMode = modeProp || (queryParams.get('mode') === 'register' ? 'register' : 'login');
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modeProp) {
      setMode(modeProp);
    }
  }, [modeProp]);

  const checkPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 8) return 1;
    const hasNum = /\d/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    if (hasNum && hasUpper) return 3;
    return 2;
  };

  const strength = checkPasswordStrength(password);
  const strengthLabels = ['Too Short', 'Weak', 'Medium', 'Strong'];
  const strengthColors = ['bg-muted', 'bg-red-500', 'bg-orange-500', 'bg-emerald-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      {/* Left side - Visual/Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-card border-r border-border relative overflow-hidden flex-col justify-center items-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        </div>
        
        {/* Animated Aurora Background behind Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full mix-blend-screen animate-[pulse_4s_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-2/3 w-80 h-80 bg-accent/20 blur-[100px] rounded-full mix-blend-screen animate-[pulse_5s_infinite_0.5s]" />

        <div className="relative z-10 max-w-lg w-full">
          <div className="mb-12">
            <Logo size="lg" />
            <h1 className="mt-8 text-4xl font-bold text-foreground leading-tight">
              Optimize your resume for the modern ATS.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of job seekers who improved their interview rate by matching their resumes exactly to job requirements.
            </p>
          </div>

          <div className="bg-background/80 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Overall Match Score</div>
                <div className="font-semibold text-foreground">Senior React Developer</div>
              </div>
              <div className="w-20 h-20">
                <ScoreRing score={87} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-2 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[85%]" />
              </div>
              <div className="h-2 w-full bg-card rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
              <div className="h-2 w-3/4 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[60%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 flex justify-center">
            <Logo />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {mode === 'login' 
                ? 'Enter your details to access your dashboard.' 
                : 'Sign up to start optimizing your resume for free.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  {mode === 'login' && (
                    <a href="#" className="text-sm text-primary hover:text-emerald-400 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Password Strength Meter */}
                {mode === 'register' && password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1 h-1.5 w-full">
                      <div className={cn("flex-1 rounded-full transition-colors", strength >= 1 ? strengthColors[strength] : "bg-muted")} />
                      <div className={cn("flex-1 rounded-full transition-colors", strength >= 2 ? strengthColors[strength] : "bg-muted")} />
                      <div className={cn("flex-1 rounded-full transition-colors", strength >= 3 ? strengthColors[strength] : "bg-muted")} />
                    </div>
                    <div className={cn("text-xs font-medium", strength >= 1 ? strengthColors[strength].replace('bg-', 'text-') : "text-muted-foreground")}>
                      {strengthLabels[strength]}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <motion.div 
                  animate={{ x: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-primary font-medium hover:text-emerald-400 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-primary font-medium hover:text-emerald-400 transition-colors"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
