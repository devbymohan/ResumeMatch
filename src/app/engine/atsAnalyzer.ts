import { AnalysisResult } from '../types';
import { TECH_SKILLS_DB, SOFT_SKILLS_DB, SECTION_PATTERNS } from '../data/mock';

export function runAtsAnalysis(resumeText: string, jobDesc: string, jobTitle: string, company: string, fileName: string): AnalysisResult {
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
