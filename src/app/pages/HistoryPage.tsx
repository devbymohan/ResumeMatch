import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Eye, Trash2, FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAnalyses } from '../context/AnalysesContext';
import { ScoreBadge } from '../components/shared/ScoreBadge';
import { cn } from '../types';

type SortField = 'date' | 'score' | 'jobTitle';
type SortDirection = 'asc' | 'desc';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { analyses, deleteAnalysis } = useAnalyses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-30 group-hover:opacity-100" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 ml-1 text-primary" /> : <ArrowDown className="w-3.5 h-3.5 ml-1 text-primary" />;
  };

  // Filter and sort analyses
  const filteredAndSortedAnalyses = (analyses || [])
    .filter(a => {
      const matchesSearch = (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (a.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filter === 'high') matchesFilter = (a.atsScore || 0) >= 80;
      if (filter === 'medium') matchesFilter = (a.atsScore || 0) >= 60 && (a.atsScore || 0) < 80;
      if (filter === 'low') matchesFilter = (a.atsScore || 0) < 60;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else if (sortField === 'score') {
        comparison = (a.atsScore || 0) - (b.atsScore || 0);
      } else if (sortField === 'jobTitle') {
        comparison = (a.jobTitle || '').localeCompare(b.jobTitle || '');
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAnalysis(id);
    toast.success('Analysis removed from history.');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
          <p className="text-muted-foreground mt-1">You have run {analyses?.length || 0} analyses total.</p>
        </div>
        <button
          onClick={() => navigate('/analyzer')}
          className="flex items-center justify-center px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Analysis
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors",
                filter === f 
                  ? "bg-primary text-white" 
                  : "bg-input-background text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              {f === 'all' ? 'All Scores' : `${f} Score`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filteredAndSortedAnalyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-input-background/50 border-b border-border text-xs text-muted-foreground">
                  <th 
                    className="p-4 font-semibold cursor-pointer group select-none"
                    onClick={() => handleSort('jobTitle')}
                  >
                    <div className="flex items-center">Role / Company {getSortIcon('jobTitle')}</div>
                  </th>
                  <th 
                    className="p-4 font-semibold cursor-pointer group select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">Date {getSortIcon('date')}</div>
                  </th>
                  <th 
                    className="p-4 font-semibold cursor-pointer group select-none text-center"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center justify-center">ATS Score {getSortIcon('score')}</div>
                  </th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedAnalyses.map((analysis, index) => (
                  <tr 
                    key={analysis.id} 
                    onClick={() => navigate(`/results/${analysis.id}`)}
                    className={cn(
                      "transition-colors cursor-pointer",
                      index % 2 === 0 ? "bg-transparent hover:bg-white/[0.03]" : "bg-white/[0.015] hover:bg-white/[0.03]"
                    )}
                  >
                    <td className="p-4">
                      <p className="font-bold text-sm text-foreground">{analysis.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{analysis.company} • {analysis.resumeFileName || "Resume.pdf"}</p>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "font-mono text-xl font-black",
                        analysis.atsScore >= 80 ? "text-primary" : analysis.atsScore >= 60 ? "text-accent" : "text-destructive"
                      )}>
                        {analysis.atsScore}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <ScoreBadge score={analysis.atsScore} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/results/${analysis.id}`)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(analysis.id, e)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-input-background rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No analyses found</h3>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              {searchTerm || filter !== 'all' 
                ? "We couldn't find any analyses matching your current filters. Try adjusting your search."
                : "You haven't run any resume analyses yet. Get started to optimize your resume!"}
            </p>
            <button
              onClick={() => {
                if (searchTerm || filter !== 'all') {
                  setSearchTerm('');
                  setFilter('all');
                } else {
                  navigate('/analyzer');
                }
              }}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              {searchTerm || filter !== 'all' ? 'Clear Filters' : 'Run Your First Analysis'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
