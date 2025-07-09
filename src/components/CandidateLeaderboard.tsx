import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Medal, 
  Award, 
  Eye, 
  Download, 
  Filter,
  Search,
  Calendar,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

interface CandidateRecord {
  id: string;
  name: string;
  email: string;
  submissionDate: string;
  overallScore: number;
  trustScore: number;
  riskLevel: string;
  position: string;
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected';
  interviewDuration: string;
  strengths: string[];
  weaknesses: string[];
}

const CandidateLeaderboard: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Load candidate data from localStorage
    loadCandidateData();
  }, []);

  useEffect(() => {
    // Filter and sort candidates
    let filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter(candidate => 
        candidate.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.overallScore - a.overallScore;
        case 'date':
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, sortBy, filterStatus]);

  const loadCandidateData = () => {
    // This would normally come from a database
    // For now, we'll simulate with localStorage and some mock data
    const mockCandidates: CandidateRecord[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        submissionDate: '2024-01-15',
        overallScore: 92,
        trustScore: 89,
        riskLevel: 'Safe',
        position: 'Software Engineer',
        status: 'Approved',
        interviewDuration: '45 minutes',
        strengths: ['Strong technical skills', 'Excellent communication', 'Leadership potential'],
        weaknesses: ['Limited experience with microservices']
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        submissionDate: '2024-01-14',
        overallScore: 87,
        trustScore: 91,
        riskLevel: 'Safe',
        position: 'Product Manager',
        status: 'Reviewed',
        interviewDuration: '50 minutes',
        strengths: ['Strategic thinking', 'Team collaboration', 'Problem solving'],
        weaknesses: ['Needs improvement in data analysis', 'Limited technical background']
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        submissionDate: '2024-01-13',
        overallScore: 78,
        trustScore: 82,
        riskLevel: 'Moderate',
        position: 'UX Designer',
        status: 'Pending',
        interviewDuration: '40 minutes',
        strengths: ['Creative thinking', 'User empathy', 'Design tools expertise'],
        weaknesses: ['Presentation skills', 'Project management experience']
      },
      {
        id: '4',
        name: 'David Thompson',
        email: 'david.thompson@email.com',
        submissionDate: '2024-01-12',
        overallScore: 73,
        trustScore: 68,
        riskLevel: 'High',
        position: 'Sales Representative',
        status: 'Rejected',
        interviewDuration: '35 minutes',
        strengths: ['Enthusiastic', 'Goal-oriented'],
        weaknesses: ['Inconsistent responses', 'Lack of relevant experience', 'Communication issues']
      }
    ];

    // Add current candidate if exists
    const currentAnalysis = localStorage.getItem('latest_analysis');
    const currentCandidate = localStorage.getItem('candidate_info');
    
    if (currentAnalysis && currentCandidate) {
      const analysis = JSON.parse(currentAnalysis);
      const candidate = JSON.parse(currentCandidate);
      
      mockCandidates.unshift({
        id: Date.now().toString(),
        name: candidate.name,
        email: candidate.email,
        submissionDate: new Date().toISOString().split('T')[0],
        overallScore: analysis.personalityScore || 0,
        trustScore: analysis.trustScore || 0,
        riskLevel: analysis.riskLevel || 'Unknown',
        position: 'Current Applicant',
        status: 'Pending',
        interviewDuration: '45 minutes',
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || []
      });
    }

    setCandidates(mockCandidates);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="h-6 w-6 flex items-center justify-center text-sm font-bold text-aura-gray-500">#{index + 1}</span>;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportLeaderboard = () => {
    const csvContent = [
      ['Rank', 'Name', 'Email', 'Position', 'Overall Score', 'Trust Score', 'Risk Level', 'Status', 'Date'].join(','),
      ...filteredCandidates.map((candidate, index) => [
        index + 1,
        candidate.name,
        candidate.email,
        candidate.position,
        candidate.overallScore,
        candidate.trustScore,
        candidate.riskLevel,
        candidate.status,
        candidate.submissionDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidate_leaderboard.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-aura-blue-600" />
              Candidate Leaderboard
            </div>
            <Button onClick={exportLeaderboard} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-aura-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'name')}
              className="p-2 border rounded-md"
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <div className="flex items-center text-sm text-aura-gray-600">
              <Filter className="mr-1 h-4 w-4" />
              {filteredCandidates.length} candidates
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-3">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} className="border rounded-lg p-4 hover:bg-aura-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(index)}
                      <div className="w-10 h-10 bg-aura-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-aura-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-aura-gray-900 truncate">
                          {candidate.name}
                        </h3>
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                        <Badge className={getRiskColor(candidate.riskLevel)}>
                          {candidate.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-aura-gray-600 truncate">
                        {candidate.email} • {candidate.position}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-xs text-aura-gray-500">
                          <Calendar className="mr-1 h-3 w-3" />
                          {candidate.submissionDate}
                        </div>
                        <div className="text-xs text-aura-gray-500">
                          Duration: {candidate.interviewDuration}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-aura-gray-600">Overall Score</div>
                      <div className="text-2xl font-bold text-aura-blue-600">
                        {candidate.overallScore}%
                      </div>
                      <Progress value={candidate.overallScore} className="w-16 h-2 mt-1" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-aura-gray-600">Trust Score</div>
                      <div className="text-lg font-semibold text-green-600">
                        {candidate.trustScore}%
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/analysis/${candidate.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
                
                {/* Strengths and Weaknesses Preview */}
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium text-green-700">Strengths: </span>
                      <span className="text-aura-gray-600">
                        {candidate.strengths.slice(0, 2).join(', ')}
                        {candidate.strengths.length > 2 && '...'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-orange-700">Areas for Development: </span>
                      <span className="text-aura-gray-600">
                        {candidate.weaknesses.slice(0, 2).join(', ')}
                        {candidate.weaknesses.length > 2 && '...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-12 text-aura-gray-500">
                <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-semibold mb-2">No Candidates Found</h3>
                <p>No candidates match your current search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateLeaderboard;