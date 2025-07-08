
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Brain, 
  Search, 
  Download, 
  Filter, 
  ArrowLeft, 
  Users, 
  BarChart3, 
  Shield, 
  TrendingUp,
  Eye,
  FileText
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  // Mock candidate data
  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      trustScore: 92,
      riskLevel: 'Low',
      growthSpeed: 'High',
      submissionDate: '2024-01-15',
      interviewStatus: 'Completed'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      trustScore: 78,
      riskLevel: 'Medium',
      growthSpeed: 'Medium',
      submissionDate: '2024-01-14',
      interviewStatus: 'Pending'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      trustScore: 95,
      riskLevel: 'Low',
      growthSpeed: 'High',
      submissionDate: '2024-01-13',
      interviewStatus: 'Completed'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.k@email.com',
      trustScore: 65,
      riskLevel: 'High',
      growthSpeed: 'Low',
      submissionDate: '2024-01-12',
      interviewStatus: 'Failed'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa.w@email.com',
      trustScore: 88,
      riskLevel: 'Low',
      growthSpeed: 'High',
      submissionDate: '2024-01-11',
      interviewStatus: 'Completed'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrowthColor = (growth: string) => {
    switch (growth.toLowerCase()) {
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || candidate.riskLevel.toLowerCase() === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const stats = {
    totalCandidates: candidates.length,
    completedInterviews: candidates.filter(c => c.interviewStatus === 'Completed').length,
    averageTrustScore: Math.round(candidates.reduce((sum, c) => sum + c.trustScore, 0) / candidates.length),
    highRiskCandidates: candidates.filter(c => c.riskLevel === 'High').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aura-blue-50 via-white to-aura-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-aura-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-aura-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-aura-blue-600" />
                <span className="text-2xl font-bold text-aura-gray-900">Admin Dashboard</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="outline" className="text-aura-blue-600 border-aura-blue-300">
                <Download className="mr-2 h-4 w-4" />
                Export All Reports
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">Total Candidates</p>
                  <p className="text-3xl font-bold text-aura-gray-900">{stats.totalCandidates}</p>
                </div>
                <Users className="h-8 w-8 text-aura-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">Completed Interviews</p>
                  <p className="text-3xl font-bold text-aura-gray-900">{stats.completedInterviews}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">Avg Trust Score</p>
                  <p className="text-3xl font-bold text-aura-gray-900">{stats.averageTrustScore}%</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">High Risk</p>
                  <p className="text-3xl font-bold text-aura-gray-900">{stats.highRiskCandidates}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="floating-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Search & Filter Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aura-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterRisk === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterRisk('all')}
                  size="sm"
                >
                  All Risk Levels
                </Button>
                <Button
                  variant={filterRisk === 'low' ? 'default' : 'outline'}
                  onClick={() => setFilterRisk('low')}
                  size="sm"
                  className={filterRisk === 'low' ? 'bg-green-600' : ''}
                >
                  Low Risk
                </Button>
                <Button
                  variant={filterRisk === 'medium' ? 'default' : 'outline'}
                  onClick={() => setFilterRisk('medium')}
                  size="sm"
                  className={filterRisk === 'medium' ? 'bg-yellow-600' : ''}
                >
                  Medium Risk
                </Button>
                <Button
                  variant={filterRisk === 'high' ? 'default' : 'outline'}
                  onClick={() => setFilterRisk('high')}
                  size="sm"
                  className={filterRisk === 'high' ? 'bg-red-600' : ''}
                >
                  High Risk
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Candidate Management ({filteredCandidates.length} results)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Growth Speed</TableHead>
                    <TableHead>Interview Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-aura-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-aura-gray-900">{candidate.name}</div>
                          <div className="text-sm text-aura-gray-500">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-semibold">{candidate.trustScore}%</span>
                          <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                              style={{ width: `${candidate.trustScore}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(candidate.riskLevel)}>
                          {candidate.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGrowthColor(candidate.growthSpeed)}>
                          {candidate.growthSpeed}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(candidate.interviewStatus)}>
                          {candidate.interviewStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{candidate.submissionDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/analysis/${candidate.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
