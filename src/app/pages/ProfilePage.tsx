import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, Mail, Phone, MapPin, Globe, Zap, Shield, 
  Clock, Bell, Lock, LogOut, CheckCircle2, TrendingUp, Briefcase 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useAnalyses } from '../context/AnalysesContext';
import { cn } from '../types';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { analyses } = useAnalyses();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jordan Rivera',
    email: user?.email || 'jordan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'jordanrivera.dev'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    digest: false,
    alerts: true
  });

  // Calculate statistics
  const totalAnalyses = analyses?.length || 0;
  const avgScore = totalAnalyses > 0 
    ? Math.round(analyses.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / totalAnalyses) 
    : 0;
  const bestAnalysis = totalAnalyses > 0 
    ? [...analyses].sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0))[0] 
    : null;

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile information updated successfully!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully.');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Account Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal details and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar (Col 1) */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur" />
              <div className="relative w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border-2 border-border group-hover:border-transparent transition-colors">
                <span className="text-3xl font-black text-primary">
                  {profileData.name.charAt(0)}
                </span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-foreground">{profileData.name}</h2>
            <p className="text-muted-foreground text-xs mb-4">{profileData.email}</p>
            <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </div>
          </div>

          {/* Upgrade Card */}
          {user?.plan !== 'pro' && (
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-6 relative overflow-hidden">
              <Zap className="absolute -right-4 -top-4 w-24 h-24 text-accent/10" />
              <h3 className="font-bold text-foreground flex items-center mb-2 relative z-10">
                <Zap className="w-4 h-4 text-accent mr-2" /> Upgrade to Pro
              </h3>
              <p className="text-xs text-foreground/80 mb-4 relative z-10 leading-relaxed">
                Get unlimited resume analyses, advanced AI keyword suggestions, and PDF reports.
              </p>
              <button 
                onClick={() => toast.info("Pro plans are free during demo preview!")}
                className="w-full py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors text-xs font-bold relative z-10"
              >
                Upgrade — $12/mo
              </button>
            </div>
          )}

          {/* Account Info */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-4 h-4 mr-2.5" />
              <span>Joined {new Date(user?.joinedAt || '2024-01-15').toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-xs text-primary font-medium">
              <Shield className="w-4 h-4 mr-2.5" />
              <span>Security & session active</span>
            </div>
          </div>
        </div>

        {/* Main Content (Col 2 & 3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <h4 className="text-xs font-medium text-muted-foreground">Total Analyses</h4>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{totalAnalyses}</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-accent/10 rounded-lg mr-3">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <h4 className="text-xs font-medium text-muted-foreground">Average Score</h4>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{avgScore}%</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="text-xs font-medium text-muted-foreground">Best Match</h4>
              </div>
              <div className="truncate">
                {bestAnalysis ? (
                  <>
                    <p className="text-sm font-bold text-foreground truncate">{bestAnalysis.jobTitle}</p>
                    <p className="text-xs text-primary font-mono font-semibold">{bestAnalysis.atsScore}% ATS Score</p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">No data yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-foreground">Personal Information</h3>
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">Save</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-white/5 transition-colors">Edit</button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField icon={<User />} label="Full Name" value={profileData.name} isEditing={isEditing} onChange={(v: string) => setProfileData({...profileData, name: v})} />
                <ProfileField icon={<Mail />} label="Email Address" value={profileData.email} isEditing={isEditing} type="email" onChange={(v: string) => setProfileData({...profileData, email: v})} />
                <ProfileField icon={<Phone />} label="Phone Number" value={profileData.phone} isEditing={isEditing} onChange={(v: string) => setProfileData({...profileData, phone: v})} />
                <ProfileField icon={<MapPin />} label="Location" value={profileData.location} isEditing={isEditing} onChange={(v: string) => setProfileData({...profileData, location: v})} />
                <ProfileField icon={<Globe />} label="Website / Portfolio" value={profileData.website} isEditing={isEditing} onChange={(v: string) => setProfileData({...profileData, website: v})} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              <ToggleField 
                label="Email Notifications" 
                description="Receive emails about your account activity and report summaries."
                icon={<Mail className="w-4 h-4" />}
                checked={notifications.email} 
                onChange={(c: boolean) => setNotifications({...notifications, email: c})} 
              />
              <ToggleField 
                label="Weekly Digest" 
                description="Get a weekly summary of your resume analysis performance."
                icon={<Bell className="w-4 h-4" />}
                checked={notifications.digest} 
                onChange={(c: boolean) => setNotifications({...notifications, digest: c})} 
              />
              <ToggleField 
                label="Job Match Alerts" 
                description="Notify me when high-compatibility job keywords are detected."
                icon={<Zap className="w-4 h-4" />}
                checked={notifications.alerts} 
                onChange={(c: boolean) => setNotifications({...notifications, alerts: c})} 
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
            <h3 className="text-base font-bold text-destructive mb-1">Danger Zone</h3>
            <p className="text-xs text-muted-foreground mb-4">Logging out will end your current session.</p>
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-xl transition-colors text-xs font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value, isEditing, type = "text", onChange }: any) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1 ml-0.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4">
          {React.cloneElement(icon, { className: 'w-full h-full' })}
        </div>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        ) : (
          <div className="w-full pl-9 pr-3 py-2 bg-input-background/60 border border-transparent rounded-lg text-sm text-foreground">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleField({ label, description, icon, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-input-background/60 rounded-xl">
      <div className="flex items-start mr-4">
        <div className="mt-0.5 text-muted-foreground mr-3">
          {icon}
        </div>
        <div>
          <h4 className="text-xs font-bold text-foreground">{label}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? "bg-primary" : "bg-switch-background"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
