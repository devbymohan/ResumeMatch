import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Target, Award, FileText, Briefcase, Zap, 
  TrendingUp, TrendingDown, ArrowRight, Lightbulb
} from 'lucide-react';
import { 
  AreaChart, Area, RadarChart, Radar, ResponsiveContainer, 
  CartesianGrid, XAxis, YAxis, Tooltip, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAnalyses } from '../context/AnalysesContext';
import { DASHBOARD_TREND } from '../data/mock';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { analyses } = useAnalyses();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const stats = useMemo(() => {
    if (analyses.length === 0) {
      return { avgScore: 0, bestScore: 0, total: 0, strongMatches: 0 };
    }
    
    const scores = analyses.map(a => a.overallScore);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / scores.length);
    const best = Math.max(...scores);
    const strong = scores.filter(s => s >= 75).length;
    
    return { avgScore: avg, bestScore: best, total: analyses.length, strongMatches: strong };
  }, [analyses]);

  const latestAnalysis = analyses[0];
  
  const radarData = useMemo(() => {
    if (!latestAnalysis) return [];
    const b = latestAnalysis.breakdown;
    return [
      { subject: 'Format', A: b.formatting, fullMark: 100 },
      { subject: 'Impact', A: b.impact, fullMark: 100 },
      { subject: 'Skills', A: b.keywordMatch, fullMark: 100 },
      { subject: 'Readability', A: b.readability, fullMark: 100 },
      { subject: 'Length', A: 85, fullMark: 100 }
    ];
  }, [latestAnalysis]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-xl">
          <p className="text-foreground font-medium mb-1">{label}</p>
          <p className="text-primary font-mono text-lg font-bold">
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
      {/* Greeting Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-foreground">
          {greeting}, {user?.name?.split(' ')[0] || 'Guest'}
        </h1>
        <p className="text-muted-foreground">
          Here's your resume performance overview.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Avg ATS Score', 
            value: `${stats.avgScore}%`, 
            icon: Target, 
            color: 'text-primary', 
            borderColor: 'border-primary',
            trend: '↑ 12% from last month',
            trendColor: 'text-primary'
          },
          { 
            label: 'Best Score', 
            value: `${stats.bestScore}%`, 
            icon: Award, 
            color: 'text-accent', 
            borderColor: 'border-accent',
            trend: '↑ 5% from last month',
            trendColor: 'text-primary'
          },
          { 
            label: 'Total Analyses', 
            value: stats.total.toString(), 
            icon: FileText, 
            color: 'text-blue-500', 
            borderColor: 'border-blue-500',
            trend: '+3 this week',
            trendColor: 'text-muted-foreground'
          },
          { 
            label: 'Strong Matches', 
            value: stats.strongMatches.toString(), 
            icon: Briefcase, 
            color: 'text-purple-500', 
            borderColor: 'border-purple-500',
            trend: '2 new matches',
            trendColor: 'text-primary'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5",
              "border-l-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              stat.borderColor
            )}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold font-mono text-foreground">{stat.value}</p>
              </div>
              <div className={cn("p-2 rounded-lg bg-background", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {stat.trend.includes('↑') || stat.trend.includes('+') ? (
                <TrendingUp className={cn("w-3.5 h-3.5", stat.trendColor)} />
              ) : stat.trend.includes('↓') || stat.trend.includes('-') ? (
                <TrendingDown className={cn("w-3.5 h-3.5", stat.trendColor)} />
              ) : null}
              <span className={cn("text-xs font-medium", stat.trendColor)}>{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Score Trend</h3>
            <p className="text-sm text-muted-foreground">Your average ATS score over time</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DASHBOARD_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#666D66" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666D66" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#059669" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6 flex flex-col"
        >
          <div className="mb-2">
            <h3 className="text-lg font-bold text-foreground">Latest Breakdown</h3>
            <p className="text-sm text-muted-foreground">Performance by category</p>
          </div>
          <div className="flex-1 min-h-[240px]">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#666D66', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#F97316"
                    fill="#F97316"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121515', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F97316' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm h-full">
                No data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Analyses + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-foreground">Recent Analyses</h3>
              <p className="text-sm text-muted-foreground">Your last 3 scanned resumes</p>
            </div>
            <button 
              onClick={() => navigate('/history')}
              className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1">
            {analyses.length > 0 ? (
              <div className="divide-y divide-border">
                {analyses.slice(0, 3).map((analysis) => (
                  <div 
                    key={analysis.id}
                    onClick={() => navigate(`/report/${analysis.id}`)}
                    className="p-4 flex items-center justify-between hover:bg-background/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background group-hover:border-primary/30 transition-colors">
                        <span className="font-mono font-bold text-foreground">{analysis.overallScore}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{analysis.jobTitle}</h4>
                        <p className="text-xs text-muted-foreground">{analysis.company} • {new Date(analysis.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No analyses yet. Start by analyzing a resume!
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Ready for your next application?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tailor your resume for that specific job description to maximize your chances.
            </p>

            {latestAnalysis?.suggestions && latestAnalysis.suggestions.length > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-background border border-border flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Recent Tip</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {latestAnalysis.suggestions[0]}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/analyzer')}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors relative z-10"
          >
            <Zap className="w-4 h-4" />
            New Analysis
          </button>
        </motion.div>
      </div>
    </div>
  );
}
