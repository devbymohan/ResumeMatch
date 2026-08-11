import { AppUser, AnalysisResult } from '../types';

export const MOCK_USER: AppUser = { id: "u1", name: "Jordan Rivera", email: "jordan@example.com", plan: "pro", joinedAt: "2024-01-15" };

export const MOCK_ANALYSES: AnalysisResult[] = [
  {
    id: "a1", createdAt: "2025-06-28T10:30:00Z", resumeFileName: "Jordan_Rivera_Resume.pdf",
    jobTitle: "Senior Frontend Engineer", company: "Stripe",
    atsScore: 84, keywordScore: 88, structureScore: 92, completenessScore: 76, readabilityScore: 80,
    matchedKeywords: ["React","TypeScript","Node.js","GraphQL","CI/CD","AWS","REST API","Agile","Jest","Webpack"],
    missingKeywords: ["Kubernetes","Docker","Redis","PostgreSQL","Microservices"],
    technicalSkills: [
      {name:"React",matched:true},{name:"TypeScript",matched:true},{name:"Node.js",matched:true},
      {name:"GraphQL",matched:true},{name:"Kubernetes",matched:false},{name:"Docker",matched:false},
      {name:"PostgreSQL",matched:false},{name:"Redis",matched:false},{name:"AWS",matched:true},{name:"Jest",matched:true},
    ],
    softSkills: [
      {name:"Communication",matched:true},{name:"Leadership",matched:true},
      {name:"Problem Solving",matched:true},{name:"Team Collaboration",matched:true},{name:"Time Management",matched:false},
    ],
    strengths: [
      "Strong technical skill alignment with 10 out of 15 required keywords",
      "Clear and well-structured professional summary",
      "Quantified achievements demonstrate measurable impact",
    ],
    weaknesses: [
      "Missing container orchestration technologies (Kubernetes, Docker)",
      "No database experience mentioned (PostgreSQL, Redis)",
      "Skills section lacks organization into categories",
    ],
    suggestions: [
      "Add Kubernetes and Docker to your skills section and projects",
      "Mention PostgreSQL or Redis in your database experience",
      "Include at least 2–3 more quantified achievements (%, $, time saved)",
      "Reorganize skills into Technical, Tools, and Soft Skills categories",
      "Add a dedicated Projects section showcasing personal work",
      "Tailor your summary to specifically mention distributed systems experience",
    ],
    sections: [
      {name:"Summary",present:true,quality:"good"},{name:"Experience",present:true,quality:"good"},
      {name:"Education",present:true,quality:"good"},{name:"Skills",present:true,quality:"fair"},
      {name:"Projects",present:false,quality:"poor"},{name:"Certifications",present:false,quality:"poor"},
    ],
    wordCount: 487, experienceYears: 6, educationLevel: "Bachelor's Degree",
  },
  {
    id: "a2", createdAt: "2025-06-20T14:00:00Z", resumeFileName: "Jordan_Rivera_Resume.pdf",
    jobTitle: "Full Stack Developer", company: "Notion",
    atsScore: 71, keywordScore: 72, structureScore: 85, completenessScore: 68, readabilityScore: 74,
    matchedKeywords: ["React","Node.js","TypeScript","REST API","MongoDB","Agile"],
    missingKeywords: ["Vue.js","Python","Elasticsearch","Kafka","gRPC","Terraform"],
    technicalSkills: [
      {name:"React",matched:true},{name:"Node.js",matched:true},{name:"Python",matched:false},
      {name:"Vue.js",matched:false},{name:"MongoDB",matched:true},{name:"Elasticsearch",matched:false},
    ],
    softSkills: [
      {name:"Communication",matched:true},{name:"Leadership",matched:false},
      {name:"Problem Solving",matched:true},{name:"Cross-functional",matched:false},
    ],
    strengths: ["Good React and Node.js coverage","Clear work history timeline"],
    weaknesses: ["Missing backend-heavy technologies","No cloud infrastructure experience"],
    suggestions: [
      "Add Python experience or projects to your portfolio",
      "Mention any experience with search tools like Elasticsearch",
      "Include cloud deployment experience (AWS, GCP, Azure)",
    ],
    sections: [
      {name:"Summary",present:true,quality:"fair"},{name:"Experience",present:true,quality:"good"},
      {name:"Education",present:true,quality:"good"},{name:"Skills",present:true,quality:"fair"},
      {name:"Projects",present:false,quality:"poor"},{name:"Certifications",present:false,quality:"poor"},
    ],
    wordCount: 412, experienceYears: 6, educationLevel: "Bachelor's Degree",
  },
  {
    id: "a3", createdAt: "2025-06-12T09:15:00Z", resumeFileName: "Jordan_Rivera_Resume.pdf",
    jobTitle: "Software Engineer II", company: "Datadog",
    atsScore: 91, keywordScore: 94, structureScore: 90, completenessScore: 88, readabilityScore: 92,
    matchedKeywords: ["React","TypeScript","Node.js","AWS","Jest","CI/CD","Agile","REST API","Git","Linux","Monitoring","Observability"],
    missingKeywords: ["Go","Prometheus"],
    technicalSkills: [
      {name:"React",matched:true},{name:"TypeScript",matched:true},{name:"Go",matched:false},
      {name:"Prometheus",matched:false},{name:"AWS",matched:true},{name:"Linux",matched:true},
    ],
    softSkills: [
      {name:"Communication",matched:true},{name:"Leadership",matched:true},
      {name:"Problem Solving",matched:true},{name:"Collaboration",matched:true},
    ],
    strengths: ["Excellent keyword coverage","Strong monitoring and observability alignment","Well-quantified experience"],
    weaknesses: ["Missing Go language experience","No mention of Prometheus or Grafana"],
    suggestions: ["Learn Go basics and mention in skills","Add Prometheus to monitoring toolset"],
    sections: [
      {name:"Summary",present:true,quality:"good"},{name:"Experience",present:true,quality:"good"},
      {name:"Education",present:true,quality:"good"},{name:"Skills",present:true,quality:"good"},
      {name:"Projects",present:true,quality:"good"},{name:"Certifications",present:true,quality:"good"},
    ],
    wordCount: 534, experienceYears: 6, educationLevel: "Bachelor's Degree",
  },
];

export const DASHBOARD_TREND = [
  {month:"Jan",score:62},{month:"Feb",score:68},{month:"Mar",score:71},
  {month:"Apr",score:75},{month:"May",score:79},{month:"Jun",score:84},
];

export const TECH_SKILLS_DB = [
  "React","Vue","Angular","TypeScript","JavaScript","Node.js","Python","Java","Go","Rust",
  "AWS","GCP","Azure","Docker","Kubernetes","CI/CD","GraphQL","REST API","MongoDB","PostgreSQL",
  "Redis","MySQL","Elasticsearch","Kafka","Terraform","Linux","Git","Jest","Webpack","Vite",
  "Next.js","Express","FastAPI","Django","Microservices","Agile","Scrum","SQL","Machine Learning",
];

export const SOFT_SKILLS_DB = [
  "Communication","Leadership","Problem Solving","Team Collaboration","Time Management",
  "Adaptability","Critical Thinking","Creativity","Project Management","Cross-functional","Mentoring",
];

export const SECTION_PATTERNS: Record<string, string[]> = {
  Summary: ["summary","objective","profile","about"],
  Experience: ["experience","employment","work history","career"],
  Education: ["education","degree","university","college","academic"],
  Skills: ["skills","technologies","proficiencies","competencies"],
  Projects: ["projects","portfolio","open source"],
  Certifications: ["certifications","certificates","credentials","licenses"],
};
