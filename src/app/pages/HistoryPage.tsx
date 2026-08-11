import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Eye, Trash2, FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
      setSortDir('desc'); // Default to descending for new field
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-20 group-hover:opacity-100" />;
    return sortDir === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  // Filter and sort analyses
  const filteredAndSortedAnalyses = analyses
    .filter(a => {
      const matchesSearch = a.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            a.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filter === 'high') matchesFilter = a.score >= 80;
      if (filter === 'medium') matchesFilter = a.score >= 50 && a.score < 80;
      if (filter === 'low') matchesFilter = a.score < 50;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'score') {
        comparison = a.score - b.score;
      } else if (sortField === 'jobTitle') {
        comparison = a.jobTitle.localeCompare(b.jobTitle);
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(id);
      // In a real app, you'd show a toast here
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
          <p className="text-muted-foreground mt-1">You have run {analyses.length} analyses total.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Analysis
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors",
                filter === f 
                  ? "bg-primary text-white" 
                  : "bg-input-background text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              {f} {f !== 'all' && 'Score'}
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
                <tr className="bg-input-background/50 border-b border-border">
                  <th 
                    className="p-4 font-medium text-muted-foreground cursor-pointer group select-none"
                    onClick={() => handleSort('jobTitle')}
                  >
                    <div className="flex items-center">Role / Company {getSortIcon('jobTitle')}</div>
                  </th>
                  <th 
                    className="p-4 font-medium text-muted-foreground cursor-pointer group select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">Date {getSortIcon('date')}</div>
                  </th>
                  <th 
                    className="p-4 font-medium text-muted-foreground cursor-pointer group select-none text-center"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center justify-center">Score {getSortIcon('score')}</div>
                  </th>
                  <th className="p-4 font-medium text-muted-foreground text-center">Status</th>
                  <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedAnalyses.map((analysis, index) => (
                  <tr 
                    key={analysis.id} 
                    className={cn(
                      "transition-colors",
                      index % 2 === 0 ? "bg-transparent hover:bg-white/[0.02]" : "bg-white/[0.02] hover:bg-white/[0.04]"
                    )}
                  >
                    <td className="p-4">
                      <p className="font-medium text-foreground">{analysis.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">{analysis.company}</p>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(analysis.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <span className={cn(
                          "font-mono text-xl font-bold",
                          analysis.score >= 80 ? "text-primary" : analysis.score >= 50 ? "text-accent" : "text-destructive"
                        )}>
                          {analysis.score}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <ScoreBadge score={analysis.score} size="sm" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/results/${analysis.id}`)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Analysis"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(analysis.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-5 h-5" />
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
            <div className="w-20 h-20 bg-input-background rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No analyses found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {searchTerm || filter !== 'all' 
                ? "We couldn't find any analyses matching your current filters. Try adjusting your search."
                : "You haven't run any resume analyses yet. Get started to see your match score and improve your chances!"}
            </p>
            <button
              onClick={() => {
                if (searchTerm || filter !== 'all') {
                  setSearchTerm('');
                  setFilter('all');
                } else {
                  navigate('/dashboard');
                }
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {searchTerm || filter !== 'all' ? 'Clear Filters' : 'Run Your First Analysis'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
