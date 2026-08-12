import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, FileText, Calendar, GraduationCap, 
  CheckCircle2, XCircle, Lightbulb, Download, RotateCcw, 
  Briefcase, Star, Clock, AlertTriangle, Layers, Code, Users
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '../types';
import { ScoreRing } from '../components/shared/ScoreRing';
import { ScoreBadge } from '../components/shared/ScoreBadge';
import { useAnalyses } from '../context/AnalysesContext';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'keywords', label: 'Keywords' },
  { id: 'skills', label: 'Skills' },
  { id: 'suggestions', label: 'Suggestions' }
];

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { analyses } = useAnalyses();
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const analysis = analyses.find(a => a.id === id) || (analyses.length > 0 ? analyses[0] : null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setIsScrolled(rect.bottom < 60);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Not Found</h2>
        <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or was removed.</p>
        <button
          onClick={() => navigate('/analyzer')}
          className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
        >
          Run New Analysis
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    toast.success('Preparing printable PDF report...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const coverageData = [
    { name: 'Matched', count: analysis.matchedKeywords?.length || 0, color: '#059669' },
    { name: 'Missing', count: analysis.missingKeywords?.length || 0, color: '#EF4444' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-28">
      {/* Back Button */}
      <button
        onClick={() => navigate('/history')}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to History
      </button>

      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative rounded-2xl bg-card border border-border p-6 md:p-8 overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center mb-3">
              <ScoreBadge score={analysis.atsScore} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{analysis.jobTitle}</h1>
            <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mb-6 gap-4">
              <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-muted-foreground" />{analysis.company}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-muted-foreground" />{new Date(analysis.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="flex items-center px-3 py-1 bg-white/5 border border-border rounded-full text-xs font-medium text-foreground">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {analysis.wordCount || 480} Words
              </span>
              <span className="flex items-center px-3 py-1 bg-white/5 border border-border rounded-full text-xs font-medium text-foreground">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-accent" />
                {analysis.experienceYears || 4}+ Yrs Exp
              </span>
              <span className="flex items-center px-3 py-1 bg-white/5 border border-border rounded-full text-xs font-medium text-foreground">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                {analysis.educationLevel || "Bachelor's Degree"}
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <ScoreRing score={analysis.atsScore} size={150} />
          </div>
        </div>
      </div>

      {/* Score Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ScoreCard title="Keyword Match" score={analysis.keywordScore || 75} color="bg-[#059669]" />
        <ScoreCard title="Structure" score={analysis.structureScore || 85} color="bg-[#3B82F6]" />
        <ScoreCard title="Completeness" score={analysis.completenessScore || 80} color="bg-[#A855F7]" />
        <ScoreCard title="Readability" score={analysis.readabilityScore || 78} color="bg-[#F97316]" />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-5 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[350px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Resume Sections
              </h3>
              <div className="space-y-3">
                {analysis.sections && analysis.sections.map((section, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-input-background/60 rounded-lg">
                    <div className="flex items-center">
                      {section.present ? (
                        <CheckCircle2 className="w-4 h-4 text-primary mr-2.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive mr-2.5" />
                      )}
                      <span className="text-sm font-medium text-foreground">{section.name}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize",
                      section.present ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
                    )}>
                      {section.quality || (section.present ? "Good" : "Missing")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="text-base font-bold text-primary flex items-center mb-3">
                  <Star className="w-4 h-4 mr-2" /> Strengths
                </h3>
                <ul className="space-y-2.5">
                  {analysis.strengths && analysis.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <h3 className="text-base font-bold text-destructive flex items-center mb-3">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Improvement Areas
                </h3>
                <ul className="space-y-2.5">
                  {analysis.weaknesses && analysis.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-foreground/90">
                      <XCircle className="w-4 h-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Matched Keywords ({analysis.matchedKeywords?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 ? (
                    analysis.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No keywords matched.</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-base font-bold text-destructive mb-4 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Missing Keywords ({analysis.missingKeywords?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                    analysis.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-xs font-semibold">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Great job! No critical keywords missing.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Keyword Coverage Comparison</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coverageData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <XAxis type="number" stroke="#666D66" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#EFF1EE" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121515', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '8px' }} 
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {coverageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" /> Technical Skills
              </h3>
              <div className="space-y-3">
                {analysis.technicalSkills && analysis.technicalSkills.length > 0 ? (
                  analysis.technicalSkills.map((skill, idx) => (
                    <SkillItem key={idx} skill={skill} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specific technical skills evaluated.</p>
                )}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" /> Soft Skills
              </h3>
              <div className="space-y-3">
                {analysis.softSkills && analysis.softSkills.length > 0 ? (
                  analysis.softSkills.map((skill, idx) => (
                    <SkillItem key={idx} skill={skill} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specific soft skills evaluated.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {analysis.suggestions && analysis.suggestions.map((suggestion, idx) => {
              let priorityColor = 'bg-primary';
              let priorityText = 'Low';
              if (idx < 2) {
                priorityColor = 'bg-destructive';
                priorityText = 'High';
              } else if (idx < 4) {
                priorityColor = 'bg-accent';
                priorityText = 'Medium';
              }

              return (
                <div key={idx} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-white/20 transition-colors">
                  <div className="mt-1 flex-shrink-0 bg-white/5 p-2 rounded-full">
                    <Lightbulb className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">Actionable Tip {idx + 1}</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted-foreground border border-border">
                        <span className={cn("w-2 h-2 rounded-full", priorityColor)} />
                        {priorityText} Priority
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
              <button 
                onClick={() => navigate('/analyzer')}
                className="flex items-center px-4 py-2.5 bg-transparent text-foreground border border-border rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Analysis
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Action Bar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border p-4 shadow-2xl"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ScoreBadge score={analysis.atsScore} />
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-foreground leading-tight">{analysis.jobTitle}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{analysis.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/analyzer')}
                  className="flex items-center px-4 py-2 bg-white/5 text-foreground border border-border rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Re-analyze
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold shadow-lg shadow-primary/20"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreCard({ title, score, color }: { title: string, score: number, color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center mb-3">
        <span className={cn("w-2 h-2 rounded-full mr-2", color)} />
        <span className="text-xs text-muted-foreground font-medium">{title}</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold font-mono text-foreground">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-input-background rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function SkillItem({ skill }: { skill: { name: string, matched: boolean } }) {
  return (
    <div className="flex items-center p-3 bg-input-background/60 rounded-lg">
      {skill.matched ? (
        <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className={cn("text-xs font-medium", skill.matched ? "text-foreground" : "text-muted-foreground")}>
            {skill.name}
          </span>
          <span className={cn("text-xs font-semibold", skill.matched ? "text-primary" : "text-muted-foreground")}>
            {skill.matched ? 'Present' : 'Missing'}
          </span>
        </div>
        <div className="h-1 w-full bg-black/30 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all", skill.matched ? "bg-primary w-full" : "bg-transparent w-0")}
          />
        </div>
      </div>
    </div>
  );
}
