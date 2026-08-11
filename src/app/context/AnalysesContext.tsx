import React, { createContext, useContext, useState, useEffect } from "react";
import { AnalysisResult } from "../types";
import { MOCK_ANALYSES } from "../data/mock";

interface AnalysesCtx {
  analyses: AnalysisResult[];
  addAnalysis: (a: AnalysisResult) => void;
  deleteAnalysis: (id: string) => void;
}

const AnalysesContext = createContext<AnalysesCtx>({
  analyses: [],
  addAnalysis: () => {},
  deleteAnalysis: () => {},
});

export const useAnalyses = () => useContext(AnalysesContext);

export function AnalysesProvider({ children }: { children: React.ReactNode }) {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(() => {
    try {
      const s = localStorage.getItem("rm_analyses");
      return s ? JSON.parse(s) : MOCK_ANALYSES;
    } catch {
      return MOCK_ANALYSES;
    }
  });

  useEffect(() => {
    localStorage.setItem("rm_analyses", JSON.stringify(analyses));
  }, [analyses]);

  const addAnalysis = (a: AnalysisResult) => {
    setAnalyses((prev) => [a, ...prev]);
  };

  const deleteAnalysis = (id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AnalysesContext.Provider value={{ analyses, addAnalysis, deleteAnalysis }}>
      {children}
    </AnalysesContext.Provider>
  );
}
