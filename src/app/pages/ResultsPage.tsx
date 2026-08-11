import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, FileText, Calendar, GraduationCap, 
  CheckCircle2, XCircle, Lightbulb, Download, RotateCcw, 
  Briefcase, Star, Clock, AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

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

// Mock detailed data since AnalysisResult might just be top-level
const mockDetailedData = {
  keywordMatch: 75,
  structure: 90,
  completeness: 85,
  readability: 82,
  sections: [
    { name: 'Contact Information', present: true, quality: 'Excellent' },
    { name: 'Professional Summary', present: true, quality: 'Good' },
    { name: 'Work Experience', present: true, quality: 'Excellent' },
    { name: 'Education', present: true, quality: 'Needs Detail' },
    { name: 'Skills', present: true, quality: 'Good' },
    { name: 'Projects', present: false, quality: 'Missing' }
  ],
  strengths: [
    'Strong action verbs used in experience bullets',
    'Clear logical flow and section hierarchy',
    'Excellent contact information formatting'
  ],
  weaknesses: [
    'Missing quantifiable metrics in recent roles',
    'Some bullet points are too long',
    'Missing link to portfolio or GitHub'
  ],
  matchedKeywords: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Agile', 'Git', 'CSS'],
  missingKeywords: ['GraphQL', 'AWS', 'Docker', 'CI/CD', 'Jest'],
  coverageData: [
    { category: 'Frontend', matched: 80 },
    { category: 'Backend', matched: 45 },
    { category: 'DevOps', matched: 20 },
    { category: 'Soft Skills', matched: 90 },
    { category: 'Tools', matched: 60 }
  ],
  techSkills: [
    { name: 'JavaScript/ES6+', matched: true },
    { name: 'React.js', matched: true },
    { name: 'TypeScript', matched: true },
    { name: 'Python', matched: false },
    { name: 'SQL', matched: false }
  ],
  softSkills: [
    { name: 'Communication', matched: true },
    { name: 'Team Leadership', matched: true },
    { name: 'Problem Solving', matched: true },
    { name: 'Mentoring', matched: false }
  ],
  suggestions: [
    'Add specific metrics (e.g., "improved performance by 20%") to your most recent role.',
    'Include missing keywords: GraphQL, AWS, Docker to better match the job description.',
    'Break down long bullet points in the Senior Developer role for better readability.',
    'Add a dedicated Projects section if you have relevant open-source contributions.',
    'Consider adding a link to your LinkedIn profile in the contact section.'
  ]
};

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAnalysis } = useAnalyses();
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const analysis = getAnalysis(id || '');

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setIsScrolled(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Not Found</h2>
        <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or was deleted.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { score, jobTitle, company, date } = analysis;
  const data = mockDetailedData; // In real app, this would come from the analysis object

  return (
    <div className="pb-24">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative rounded-2xl bg-card border border-border p-6 md:p-8 overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center mb-4">
              <ScoreBadge score={score} className="mr-3" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{jobTitle}</h1>
            <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="mr-4">{company}</span>
              <Clock className="w-4 h-4 mr-2" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="flex items-center px-3 py-1 bg-white/5 border border-border rounded-full text-sm text-foreground">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                482 Words
              </span>
              <span className="flex items-center px-3 py-1 bg-white/5 border border-border rounded-full text-sm text-foreground">
                <Calendar className="w-4 h-4 mr-2 text-accent" />
                5 Yrs Exp
              </span>
              <span className="flex items-center px-3 py-1 bg-white/5 border border-border rounded-full text-sm text-foreground">
                <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                B.S. Degree
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <ScoreRing score={score} size={160} strokeWidth={12} />
          </div>
        </div>
      </div>

      {/* Score Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ScoreCard title="Keyword Match" score={data.keywordMatch} color="bg-[#059669]" />
        <ScoreCard title="Structure" score={data.structure} color="bg-[#3B82F6]" />
        <ScoreCard title="Completeness" score={data.completeness} color="bg-[#A855F7]" />
        <ScoreCard title="Readability" score={data.readability} color="bg-[#F97316]" />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resume Sections</h3>
              <div className="space-y-4">
                {data.sections.map((section, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-input-background rounded-lg">
                    <div className="flex items-center">
                      {section.present ? (
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive mr-3" />
                      )}
                      <span className="text-foreground">{section.name}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      section.present ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
                    )}>
                      {section.quality}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary flex items-center mb-4">
                  <Star className="w-5 h-5 mr-2" /> Strengths
                </h3>
                <ul className="space-y-3">
                  {data.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-destructive flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Weaknesses
                </h3>
                <ul className="space-y-3">
                  {data.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start text-foreground/80">
                      <XCircle className="w-4 h-4 text-destructive mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {data.matchedKeywords.map((kw, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {data.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Keyword Coverage by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.coverageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="category" stroke="#666D66" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666D66" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#121515', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '8px' }} 
                    />
                    <Bar dataKey="matched" radius={[4, 4, 0, 0]}>
                      {data.coverageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.matched > 70 ? '#059669' : entry.matched > 40 ? '#F97316' : '#EF4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Technical Skills</h3>
              <div className="space-y-4">
                {data.techSkills.map((skill, idx) => (
                  <SkillItem key={idx} skill={skill} />
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Soft Skills</h3>
              <div className="space-y-4">
                {data.softSkills.map((skill, idx) => (
                  <SkillItem key={idx} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {data.suggestions.map((suggestion, idx) => {
              // Determine priority
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
                    <Lightbulb className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">Suggestion {idx + 1}</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted-foreground border border-border">
                        <span className={cn("w-2 h-2 rounded-full", priorityColor)} />
                        {priorityText} Priority
                      </div>
                    </div>
                    <p className="text-foreground/80">{suggestion}</p>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
              <button className="flex items-center px-4 py-2 bg-transparent text-foreground border border-border rounded-lg hover:bg-white/5 transition-colors">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Analysis
              </button>
              <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border p-4 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ScoreBadge score={score} size="sm" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground leading-tight">{jobTitle}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center px-4 py-2 bg-white/5 text-foreground border border-border rounded-lg hover:bg-white/10 transition-colors text-sm font-medium">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Re-analyze
                </button>
                <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-lg shadow-primary/25">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents
function ScoreCard({ title, score, color }: { title: string, score: number, color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center mb-4">
        <span className={cn("w-2 h-2 rounded-full mr-2", color)} />
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold font-mono text-foreground">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-input-background rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function SkillItem({ skill }: { skill: { name: string, matched: boolean } }) {
  return (
    <div className="flex items-center p-3 bg-input-background rounded-lg group">
      {skill.matched ? (
        <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className={cn("text-sm font-medium", skill.matched ? "text-foreground" : "text-muted-foreground line-through")}>
            {skill.name}
          </span>
          <span className="text-xs text-muted-foreground">{skill.matched ? 'Present' : 'Missing'}</span>
        </div>
        <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full", skill.matched ? "bg-primary" : "bg-transparent")}
            initial={{ width: 0 }}
            animate={{ width: skill.matched ? "100%" : "0%" }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
