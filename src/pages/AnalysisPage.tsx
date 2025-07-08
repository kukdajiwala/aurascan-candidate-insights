
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ArrowLeft, 
  Download, 
  User, 
  Shield, 
  Heart, 
  TrendingUp, 
  BarChart3,
  Eye,
  Clock,
  FileText
} from 'lucide-react';

const AnalysisPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  // Load real analysis data from localStorage
  const [candidateData, setCandidateData] = useState({
    id: candidateId,
    name: 'Unknown Candidate',
    email: 'unknown@email.com',
    photo: '/api/placeholder/200/200',
    submissionDate: new Date().toISOString().split('T')[0],
    interviewDuration: '0 minutes',
    analysis: {
      personalityScore: 0,
      trustScore: 0,
      riskLevel: 'Unknown',
      loyaltyPrediction: 0,
      consistencyScore: 0,
      behaviorPrediction: 'Pending',
      cognitiveMapping: 'Unknown',
      careerGrowth: 'Unknown',
      aiDetection: 'Pending',
      communicationSkills: 0,
      technicalAptitude: 0,
      leadershipPotential: 0,
      stressHandling: 0
    },
    voiceAnalysis: {
      tonality: 'Unknown',
      speechClarity: 0,
      emotionalStability: 0,
      confidence: 0
    },
    facialAnalysis: {
      attentiveness: 0,
      genuineness: 0,
      engagement: 0,
      trustworthiness: 0
    },
    strengths: ['Analysis pending'],
    weaknesses: ['Analysis pending'],
    recommendations: ['Complete interview first']
  });

  // Load data on component mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('latest_analysis');
    const savedCandidateInfo = localStorage.getItem('candidate_info');
    
    if (savedAnalysis && savedCandidateInfo) {
      const analysis = JSON.parse(savedAnalysis);
      const candidateInfo = JSON.parse(savedCandidateInfo);
      
      setCandidateData({
        id: candidateId,
        name: candidateInfo.name || 'Unknown Candidate',
        email: candidateInfo.email || 'unknown@email.com',
        photo: '/api/placeholder/200/200',
        submissionDate: new Date().toISOString().split('T')[0],
        interviewDuration: '45 minutes', // This would come from actual interview data
        analysis: {
          personalityScore: analysis.personalityScore || 0,
          trustScore: analysis.trustScore || 0,
          riskLevel: analysis.riskLevel || 'Unknown',
          loyaltyPrediction: analysis.loyaltyPrediction || 0,
          consistencyScore: analysis.consistencyScore || 0,
          behaviorPrediction: analysis.behaviorPrediction || 'Pending',
          cognitiveMapping: analysis.cognitiveMapping || 'Unknown',
          careerGrowth: analysis.careerGrowth || 'Unknown',
          aiDetection: analysis.aiDetection || 'Pending',
          communicationSkills: analysis.communicationSkills || 0,
          technicalAptitude: analysis.technicalAptitude || 0,
          leadershipPotential: analysis.leadershipPotential || 0,
          stressHandling: analysis.stressHandling || 0
        },
        voiceAnalysis: {
          tonality: analysis.mood || 'Unknown',
          speechClarity: 95, // These would come from actual voice analysis
          emotionalStability: analysis.emotionalStability || 0,
          confidence: analysis.confidenceLevel || 0
        },
        facialAnalysis: {
          attentiveness: 92, // These would come from actual facial analysis
          genuineness: 89,
          engagement: 94,
          trustworthiness: analysis.trustScore || 0
        },
        strengths: analysis.strengths || ['Analysis pending'],
        weaknesses: analysis.weaknesses || ['Analysis pending'],
        recommendations: analysis.recommendations || ['Complete interview first']
      });
    }
  }, [candidateId]);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
                onClick={() => navigate('/admin')}
                className="text-aura-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-aura-blue-600" />
                <span className="text-2xl font-bold text-aura-gray-900">Detailed Analysis</span>
              </div>
            </div>
            
            <Button className="aura-gradient text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Candidate Overview */}
        <Card className="floating-card mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-aura-gray-200 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-aura-gray-500" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-aura-gray-900 mb-2">{candidateData.name}</h1>
                <p className="text-lg text-aura-gray-600 mb-4">{candidateData.email}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-sm text-aura-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    Submitted: {candidateData.submissionDate}
                  </div>
                  <div className="flex items-center text-sm text-aura-gray-600">
                    <Eye className="mr-1 h-4 w-4" />
                    Interview: {candidateData.interviewDuration}
                  </div>
                  <Badge className={getRiskColor(candidateData.analysis.riskLevel)}>
                    {candidateData.analysis.riskLevel} Risk
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-aura-gray-600">Overall Score</p>
                <p className="text-4xl font-bold text-aura-blue-600">{candidateData.analysis.personalityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Analysis Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">Trust Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(candidateData.analysis.trustScore)}`}>
                    {candidateData.analysis.trustScore}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={candidateData.analysis.trustScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">Loyalty Prediction</p>
                  <p className={`text-2xl font-bold ${getScoreColor(candidateData.analysis.loyaltyPrediction)}`}>
                    {candidateData.analysis.loyaltyPrediction}%
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <Progress value={candidateData.analysis.loyaltyPrediction} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">Consistency</p>
                  <p className={`text-2xl font-bold ${getScoreColor(candidateData.analysis.consistencyScore)}`}>
                    {candidateData.analysis.consistencyScore}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={candidateData.analysis.consistencyScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-aura-gray-600">Career Growth</p>
                  <p className="text-lg font-bold text-aura-gray-900">{candidateData.analysis.careerGrowth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-aura-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Assessment */}
          <Card className="floating-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-aura-blue-600" />
                Skills Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Communication Skills</span>
                  <span className={`text-sm font-semibold ${getScoreColor(candidateData.analysis.communicationSkills)}`}>
                    {candidateData.analysis.communicationSkills}%
                  </span>
                </div>
                <Progress value={candidateData.analysis.communicationSkills} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Technical Aptitude</span>
                  <span className={`text-sm font-semibold ${getScoreColor(candidateData.analysis.technicalAptitude)}`}>
                    {candidateData.analysis.technicalAptitude}%
                  </span>
                </div>
                <Progress value={candidateData.analysis.technicalAptitude} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Leadership Potential</span>
                  <span className={`text-sm font-semibold ${getScoreColor(candidateData.analysis.leadershipPotential)}`}>
                    {candidateData.analysis.leadershipPotential}%
                  </span>
                </div>
                <Progress value={candidateData.analysis.leadershipPotential} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Stress Handling</span>
                  <span className={`text-sm font-semibold ${getScoreColor(candidateData.analysis.stressHandling)}`}>
                    {candidateData.analysis.stressHandling}%
                  </span>
                </div>
                <Progress value={candidateData.analysis.stressHandling} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Voice & Facial Analysis */}
          <Card className="floating-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-aura-blue-600" />
                Biometric Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-aura-gray-900 mb-3">Voice Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Speech Clarity</span>
                      <span className="text-sm font-semibold">{candidateData.voiceAnalysis.speechClarity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Emotional Stability</span>
                      <span className="text-sm font-semibold">{candidateData.voiceAnalysis.emotionalStability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Confidence Level</span>
                      <span className="text-sm font-semibold">{candidateData.voiceAnalysis.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-aura-gray-900 mb-3">Facial Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Attentiveness</span>
                      <span className="text-sm font-semibold">{candidateData.facialAnalysis.attentiveness}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Genuineness</span>
                      <span className="text-sm font-semibold">{candidateData.facialAnalysis.genuineness}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement</span>
                      <span className="text-sm font-semibold">{candidateData.facialAnalysis.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Trustworthiness</span>
                      <span className="text-sm font-semibold">{candidateData.facialAnalysis.trustworthiness}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="floating-card">
            <CardHeader>
              <CardTitle className="text-green-700">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {candidateData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardHeader>
              <CardTitle className="text-yellow-700">Areas for Development</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {candidateData.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span className="text-sm">{weakness}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardHeader>
              <CardTitle className="text-blue-700">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {candidateData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
