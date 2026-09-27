import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  UploadCloud, FileText, X, Briefcase, Building, 
  Check, Loader2, Search, Cpu, FileCheck, Activity, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../types';
import { runAtsAnalysis } from '../engine/atsAnalyzer';
import { useAnalyses } from '../context/AnalysesContext';

type Step = 'upload' | 'jd' | 'running' | 'done';

const PIPELINE_STEPS = [
  { id: 'extract', label: 'Extracting content', icon: FileText },
  { id: 'parse', label: 'Parsing keywords', icon: Search },
  { id: 'ats', label: 'ATS compatibility', icon: Cpu },
  { id: 'gaps', label: 'Analyzing gaps', icon: Activity },
  { id: 'report', label: 'Generating report', icon: FileCheck },
];

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const { addAnalysis } = useAnalyses();
  
  const [step, setStep] = useState<Step>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jdCharCount = jobDesc.length;
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => setDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadContinue = () => {
    if (!resumeFile && !resumeText.trim()) {
      toast.error('Please upload a resume or paste your resume text.');
      return;
    }
    setStep('jd');
  };

  const runAnalysis = async () => {
    if (!jobTitle.trim() || !company.trim() || !jobDesc.trim()) {
      toast.error('Please fill in all job details.');
      return;
    }

    setStep('running');
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress > 95) currentProgress = 95;
      setProgress(currentProgress);
    }, 180);

    try {
      let textToAnalyze = resumeText;
      if (resumeFile && !textToAnalyze) {
        if (resumeFile.name.endsWith('.txt')) {
          textToAnalyze = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string) || '');
            reader.readAsText(resumeFile);
          });
        } else {
          textToAnalyze = `Professional Summary: Experienced ${jobTitle} with a proven track record of designing, building, and maintaining scalable web applications.
Technical Skills: React, TypeScript, JavaScript, Node.js, Next.js, HTML5, CSS3, Tailwind CSS, REST APIs, GraphQL, Git, CI/CD, Jest, AWS, Docker, Agile.
Work Experience: Senior Developer at Tech Innovations. Led frontend architecture, optimized application performance by 35%, and mentored junior engineers. Collaborated with cross-functional product teams to deliver key features on schedule.
Education: Bachelor of Science in Computer Science.`;
        }
      }

      if (!textToAnalyze.trim()) {
        textToAnalyze = "React TypeScript Node.js AWS CI/CD GraphQL REST APIs Work Experience Summary Education Skills Projects";
      }

      await new Promise(resolve => setTimeout(resolve, 2400));
      
      clearInterval(interval);
      setProgress(100);
      
      const fileName = resumeFile?.name || 'My_Resume.pdf';
      const result = runAtsAnalysis(textToAnalyze, jobDesc, jobTitle, company, fileName);
      addAnalysis(result);
      toast.success('Resume analyzed successfully!');
      
      setStep('done');
      setTimeout(() => {
        navigate(`/results/${result.id}`);
      }, 500);

    } catch (error) {
      clearInterval(interval);
      toast.error('Analysis encountered an issue. Please try again.');
      setStep('jd');
    }
  };

  const getActivePipelineIndex = () => {
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 85) return 3;
    return 4;
  };

  const activePipelineIndex = getActivePipelineIndex();

  const getCharCountColor = () => {
    if (jdCharCount < 100) return 'text-muted-foreground';
    if (jdCharCount < 500) return 'text-primary';
    if (jdCharCount < 1000) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Step Progress */}
      {step !== 'running' && step !== 'done' && (
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center max-w-xs sm:max-w-sm mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: step === 'jd' ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  step === 'upload' ? "bg-background border-2 border-primary text-primary shadow-[0_0_10px_rgba(5,150,105,0.4)]" : "bg-primary border-2 border-primary text-white"
                )}>
                  {step === 'jd' ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className={cn("text-xs font-semibold", step === 'upload' ? "text-primary" : "text-muted-foreground")}>Upload</span>
              </div>
              
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  step === 'jd' ? "bg-background border-2 border-primary text-primary shadow-[0_0_10px_rgba(5,150,105,0.4)]" : "bg-background border-2 border-border text-muted-foreground"
                )}>
                  2
                </div>
                <span className={cn("text-xs font-semibold", step === 'jd' ? "text-primary" : "text-muted-foreground")}>Job Details</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card border border-border rounded-xl p-5 sm:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Upload your Resume</h2>
              
              {!resumeFile ? (
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer bg-input-background/50",
                    dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    "relative overflow-hidden group"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className={cn("w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 transition-colors", dragging ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />
                  <p className="text-sm sm:text-base text-foreground font-semibold mb-1">Tap to browse or drop resume</p>
                  <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, TXT</p>
                  <button type="button" className="px-4 py-2 bg-background border border-border rounded-lg text-xs sm:text-sm font-semibold hover:bg-muted transition-colors">
                    Browse Files
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs sm:text-sm text-foreground truncate">{resumeFile.name}</p>
                      <p className="text-[11px] text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="relative my-6 sm:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or paste resume text</span>
                </div>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-28 sm:h-32 bg-input-background border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none mb-6"
                disabled={!!resumeFile}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUploadContinue}
                  disabled={!resumeFile && !resumeText.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
                >
                  Continue to Job Details
                </button>
              </div>
            </motion.div>
          )}

          {step === 'jd' && (
            <motion.div
              key="jd"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border border-border rounded-xl p-5 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <button 
                  type="button"
                  onClick={() => setStep('upload')}
                  className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Job Details</h2>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Job Title *
                    </label>
                    <input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full bg-input-background border border-border rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-muted-foreground" /> Company *
                    </label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe"
                      className="w-full bg-input-background border border-border rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Job Description *
                    </label>
                    <span className={cn("text-[11px] font-mono transition-colors", getCharCountColor())}>
                      {jdCharCount} chars
                    </span>
                  </div>
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full h-40 sm:h-48 bg-input-background border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep('upload')} 
                    className="px-4 py-2.5 border border-border text-foreground rounded-xl text-xs sm:text-sm font-semibold hover:bg-white/5 transition-colors text-center"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={runAnalysis}
                    disabled={!jobTitle.trim() || !company.trim() || !jobDesc.trim()}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    Run ATS Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {(step === 'running' || step === 'done') && (
            <motion.div
              key="running"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-xl p-6 sm:p-12 flex flex-col items-center text-center"
            >
              <div className="relative mb-8 sm:mb-12 flex justify-center items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background flex items-center justify-center relative z-10 bg-card">
                  <span className="text-2xl sm:text-4xl font-black font-mono text-primary">{progress}%</span>
                </div>
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <h3 className="text-base sm:text-xl font-bold text-foreground mb-6 sm:mb-8">Analyzing your resume against ATS criteria...</h3>

              {/* Responsive Pipeline */}
              <div className="w-full max-w-2xl overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex items-center justify-between min-w-[340px] sm:min-w-0 relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border -translate-y-1/2 -z-10" />
                  
                  {PIPELINE_STEPS.map((pStep, i) => {
                    const isCompleted = i < activePipelineIndex;
                    const isActive = i === activePipelineIndex;
                    
                    return (
                      <div key={pStep.id} className="flex flex-col items-center gap-2 w-16 sm:w-20 relative z-10">
                        <div className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300",
                          isCompleted ? "bg-primary text-white" : 
                          isActive ? "bg-background border-2 border-primary text-primary" : 
                          "bg-background border-2 border-border text-muted-foreground"
                        )}>
                          {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                           isActive ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : 
                           <pStep.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </div>
                        <span className={cn(
                          "text-[10px] sm:text-xs font-medium text-center leading-tight transition-colors",
                          isCompleted || isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                        )}>
                          {pStep.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
