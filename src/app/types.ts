import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AppUser {
  id: string; name: string; email: string; plan: "free" | "pro"; joinedAt: string;
}
export interface SectionEntry { name: string; present: boolean; quality: "good" | "fair" | "poor" }
export interface SkillEntry { name: string; matched: boolean }
export interface AnalysisResult {
  id: string; createdAt: string; resumeFileName: string; jobTitle: string; company: string;
  atsScore: number; keywordScore: number; structureScore: number;
  completenessScore: number; readabilityScore: number;
  matchedKeywords: string[]; missingKeywords: string[];
  technicalSkills: SkillEntry[]; softSkills: SkillEntry[];
  strengths: string[]; weaknesses: string[]; suggestions: string[];
  sections: SectionEntry[]; wordCount: number; experienceYears: number; educationLevel: string;
}
