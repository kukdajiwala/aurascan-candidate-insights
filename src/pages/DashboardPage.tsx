
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Users, 
  BarChart3, 
  Shield, 
  Heart, 
  TrendingUp, 
  Clock, 
  Download,
  LogOut,
  Settings,
  PlayCircle
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState({
    personalityScore: 0,
    trustScore: 0,
    riskLevel: 'Unknown',
    loyaltyPrediction: 0,
    consistencyScore: 0,
    behaviorPrediction: 'Pending',
    cognitiveMapping: 'Unknown',
    careerGrowth: 'Unknown',
    aiDetection: 'Pending'
  });

  const [candidateInfo, setCandidateInfo] = useState({
    name: 'Guest User',
    email: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real analysis data from localStorage
    const loadAnalysisData = () => {
      try {
        const savedAnalysis = localStorage.getItem('latest_analysis');
        const savedCandidateInfo = localStorage.getItem('candidate_info');
        
        if (savedAnalysis) {
          const parsedAnalysis = JSON.parse(savedAnalysis);
          setAnalysisData({
            personalityScore: parsedAnalysis.personalityScore || 0,
            trustScore: parsedAnalysis.trustScore || 0,
            riskLevel: parsedAnalysis.riskLevel || 'Unknown',
            loyaltyPrediction: parsedAnalysis.loyaltyPrediction || 0,
            consistencyScore: parsedAnalysis.consistencyScore || 0,
            behaviorPrediction: parsedAnalysis.behaviorPrediction || 'Pending',
            cognitiveMapping: parsedAnalysis.cognitiveMapping || 'Unknown',
            careerGrowth: parsedAnalysis.careerGrowth || 'Unknown',
            aiDetection: parsedAnalysis.aiDetection || 'Pending'
          });
        }
        
        if (savedCandidateInfo) {
          const parsedCandidateInfo = JSON.parse(savedCandidateInfo);
          setCandidateInfo({
            name: parsedCandidateInfo.name || 'Guest User',
            email: parsedCandidateInfo.email || ''
          });
        }
      } catch (error) {
        console.error('Failed to load analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(loadAnalysisData, 1500);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🎯';
    if (score >= 80) return '✅';
    if (score >= 70) return '👍';
    if (score >= 60) return '⚠️';
    return '❌';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aura-blue-50 via-white to-aura-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-aura-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-aura-blue-600" />
              <span className="text-2xl font-bold text-aura-gray-900">AURASCAN™</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/interview')}
                className="text-aura-blue-600 border-aura-blue-300"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Interview
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="text-aura-gray-600"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-aura-gray-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-aura-gray-900 mb-2">
            Welcome Back, {candidateInfo.name}!
          </h1>
          <p className="text-xl text-aura-gray-600">
            {analysisData.personalityScore > 0 ? 'Your AI analysis results are ready for review' : 'Complete an interview to see your AI analysis results'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aura-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-aura-gray-600">AI is analyzing your profile...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="floating-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-aura-gray-600">Overall Score</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-aura-gray-900">{analysisData.personalityScore}%</p>
                        <span className="ml-2 text-2xl">{getScoreEmoji(analysisData.personalityScore)}</span>
                      </div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-aura-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="floating-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-aura-gray-600">Trust Level</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-aura-gray-900">{analysisData.trustScore}%</p>
                        <span className="ml-2 text-2xl">{getScoreEmoji(analysisData.trustScore)}</span>
                      </div>
                    </div>
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="floating-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-aura-gray-600">Risk Assessment</p>
                      <Badge className={getRiskColor(analysisData.riskLevel)}>
                        {analysisData.riskLevel} Risk
                      </Badge>
                    </div>
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="floating-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-aura-gray-600">Career Growth</p>
                      <p className="text-2xl font-bold text-aura-gray-900">{analysisData.careerGrowth}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-aura-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="floating-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-aura-blue-600" />
                    AI Analysis Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Personality Assessment</span>
                      <span className="text-sm text-aura-gray-600">{analysisData.personalityScore}%</span>
                    </div>
                    <Progress value={analysisData.personalityScore} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Loyalty Prediction</span>
                      <span className="text-sm text-aura-gray-600">{analysisData.loyaltyPrediction}%</span>
                    </div>
                    <Progress value={analysisData.loyaltyPrediction} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Consistency Score</span>
                      <span className="text-sm text-aura-gray-600">{analysisData.consistencyScore}%</span>
                    </div>
                    <Progress value={analysisData.consistencyScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-aura-gray-600">Behavior Prediction</p>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        {analysisData.behaviorPrediction}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-aura-gray-600">AI Detection</p>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        {analysisData.aiDetection}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="floating-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-aura-blue-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.personalityScore > 0 ? (
                    <>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">AI-Generated Insights</h4>
                        <div className="text-sm text-green-700 space-y-1">
                          <p>• Trust Score: <strong>{analysisData.trustScore}%</strong></p>
                          <p>• Risk Level: <strong>{analysisData.riskLevel}</strong></p>
                          <p>• Behavior: <strong>{analysisData.behaviorPrediction}</strong></p>
                          <p>• AI Detection: <strong>{analysisData.aiDetection}</strong></p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Analysis Complete</h4>
                        <p className="text-sm text-blue-700">
                          Your responses have been analyzed using advanced AI algorithms. 
                          The results show your cognitive mapping as <strong>{analysisData.cognitiveMapping}</strong> 
                          with a career growth potential rated as <strong>{analysisData.careerGrowth}</strong>.
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-800 mb-2">Next Steps</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Review detailed analysis report</li>
                          <li>• Schedule follow-up interview if needed</li>
                          <li>• Contact HR for next phase</li>
                          <li>• Prepare for technical assessment</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <h4 className="font-semibold text-gray-800 mb-2">No Analysis Available</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Complete an AI interview to get personalized insights and recommendations.
                      </p>
                      <Button
                        onClick={() => navigate('/interview')}
                        className="aura-gradient text-white"
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Interview
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/interview')}
                className="aura-gradient text-white px-8 py-3"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Start AI Interview
              </Button>
              
              <Button
                variant="outline"
                className="border-aura-blue-300 text-aura-blue-600 px-8 py-3"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Full Report
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="border-aura-gray-300 text-aura-gray-600 px-8 py-3"
              >
                <Settings className="mr-2 h-5 w-5" />
                View Admin Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
