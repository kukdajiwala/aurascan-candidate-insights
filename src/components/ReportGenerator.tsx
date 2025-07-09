import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileText, 
  Printer, 
  Share2,
  Brain,
  Shield,
  Heart,
  TrendingUp,
  BarChart3,
  Eye,
  User,
  Calendar,
  Clock
} from 'lucide-react';
import { AnalysisResult } from '@/lib/openai';

interface ReportGeneratorProps {
  candidateData: {
    id?: string;
    name: string;
    email: string;
    submissionDate?: string;
    interviewDuration?: string;
    position?: string;
    analysis: AnalysisResult;
  };
  onDownload?: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ candidateData, onDownload }) => {
  const generateHTMLReport = () => {
    const reportHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AURASCAN AI Analysis Report - ${candidateData.name}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #f8fafc;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .header {
                background: linear-gradient(135deg, #3b82f6, #1e40af);
                color: white;
                padding: 40px;
                border-radius: 12px;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                font-weight: 700;
            }
            
            .header p {
                font-size: 1.2rem;
                opacity: 0.9;
            }
            
            .candidate-info {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin-bottom: 30px;
            }
            
            .candidate-info h2 {
                color: #1e40af;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .info-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background: #f1f5f9;
                border-radius: 8px;
            }
            
            .info-item strong {
                margin-right: 10px;
                color: #1e40af;
            }
            
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .metric-card {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            
            .metric-score {
                font-size: 2.5rem;
                font-weight: 700;
                color: #1e40af;
                margin: 10px 0;
            }
            
            .metric-label {
                color: #64748b;
                font-weight: 500;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                overflow: hidden;
                margin-top: 10px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #1e40af);
                transition: width 0.3s ease;
            }
            
            .analysis-section {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin-bottom: 30px;
            }
            
            .analysis-section h3 {
                color: #1e40af;
                margin-bottom: 20px;
                font-size: 1.3rem;
            }
            
            .skills-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .skill-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: #f8fafc;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            
            .skill-name {
                font-weight: 500;
            }
            
            .skill-score {
                font-weight: 600;
                color: #1e40af;
            }
            
            .badge {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.875rem;
                font-weight: 500;
                margin: 5px;
            }
            
            .badge-safe { background: #dcfce7; color: #166534; }
            .badge-moderate { background: #fef3c7; color: #92400e; }
            .badge-high { background: #fecaca; color: #991b1b; }
            
            .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
            }
            
            .insight-card {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .insight-card h4 {
                margin-bottom: 15px;
                font-size: 1.1rem;
            }
            
            .insight-card.strengths h4 { color: #059669; }
            .insight-card.weaknesses h4 { color: #d97706; }
            .insight-card.recommendations h4 { color: #7c3aed; }
            
            .insight-list {
                list-style: none;
            }
            
            .insight-list li {
                padding: 8px 0;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .insight-list li:before {
                content: "•";
                color: #3b82f6;
                font-weight: bold;
                margin-right: 10px;
            }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding: 20px;
                color: #64748b;
                font-size: 0.9rem;
            }
            
            @media print {
                body { background: white; }
                .container { padding: 10px; }
                .header { background: #1e40af !important; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧠 AURASCAN AI ANALYSIS REPORT</h1>
                <p>Advanced Candidate Assessment & Behavioral Analysis</p>
            </div>
            
            <div class="candidate-info">
                <h2>👤 Candidate Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Name:</strong> ${candidateData.name}
                    </div>
                    <div class="info-item">
                        <strong>Email:</strong> ${candidateData.email}
                    </div>
                    <div class="info-item">
                        <strong>Position:</strong> ${candidateData.position || 'Not specified'}
                    </div>
                    <div class="info-item">
                        <strong>Analysis Date:</strong> ${candidateData.submissionDate || new Date().toLocaleDateString()}
                    </div>
                    <div class="info-item">
                        <strong>Interview Duration:</strong> ${candidateData.interviewDuration || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Report ID:</strong> ${candidateData.id || 'N/A'}
                    </div>
                </div>
            </div>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label">Overall Personality Score</div>
                    <div class="metric-score">${candidateData.analysis.personalityScore}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${candidateData.analysis.personalityScore}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Trust Score</div>
                    <div class="metric-score">${candidateData.analysis.trustScore}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${candidateData.analysis.trustScore}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Risk Assessment</div>
                    <div class="badge badge-${candidateData.analysis.riskLevel?.toLowerCase()}">${candidateData.analysis.riskLevel} Risk</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Career Growth Potential</div>
                    <div class="metric-score">${candidateData.analysis.careerGrowth}</div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>📊 Skills Assessment</h3>
                <div class="skills-grid">
                    <div>
                        <div class="skill-item">
                            <span class="skill-name">Communication Skills</span>
                            <span class="skill-score">${candidateData.analysis.communicationSkills}%</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-name">Technical Aptitude</span>
                            <span class="skill-score">${candidateData.analysis.technicalAptitude}%</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-name">Leadership Potential</span>
                            <span class="skill-score">${candidateData.analysis.leadershipPotential}%</span>
                        </div>
                    </div>
                    <div>
                        <div class="skill-item">
                            <span class="skill-name">Stress Handling</span>
                            <span class="skill-score">${candidateData.analysis.stressHandling}%</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-name">Confidence Level</span>
                            <span class="skill-score">${candidateData.analysis.confidenceLevel}%</span>
                        </div>
                        <div class="skill-item">
                            <span class="skill-name">Emotional Stability</span>
                            <span class="skill-score">${candidateData.analysis.emotionalStability}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>🎯 Behavioral Analysis</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Detected Mood:</strong> ${candidateData.analysis.mood}
                    </div>
                    <div class="info-item">
                        <strong>Cognitive Mapping:</strong> ${candidateData.analysis.cognitiveMapping}
                    </div>
                    <div class="info-item">
                        <strong>Loyalty Prediction:</strong> ${candidateData.analysis.loyaltyPrediction}%
                    </div>
                    <div class="info-item">
                        <strong>Consistency Score:</strong> ${candidateData.analysis.consistencyScore}%
                    </div>
                    <div class="info-item">
                        <strong>AI Detection:</strong> ${candidateData.analysis.aiDetection}
                    </div>
                    <div class="info-item">
                        <strong>Behavior Prediction:</strong> ${candidateData.analysis.behaviorPrediction}
                    </div>
                </div>
            </div>
            
            <div class="insights-grid">
                <div class="insight-card strengths">
                    <h4>✅ Key Strengths</h4>
                    <ul class="insight-list">
                        ${candidateData.analysis.strengths?.map(strength => `<li>${strength}</li>`).join('') || '<li>No strengths identified</li>'}
                    </ul>
                </div>
                
                <div class="insight-card weaknesses">
                    <h4>⚠️ Areas for Development</h4>
                    <ul class="insight-list">
                        ${candidateData.analysis.weaknesses?.map(weakness => `<li>${weakness}</li>`).join('') || '<li>No weaknesses identified</li>'}
                    </ul>
                </div>
                
                <div class="insight-card recommendations">
                    <h4>💡 AI Recommendations</h4>
                    <ul class="insight-list">
                        ${candidateData.analysis.recommendations?.map(recommendation => `<li>${recommendation}</li>`).join('') || '<li>No recommendations available</li>'}
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>🤖 Generated by AURASCAN AI Interview Platform</p>
                <p>Report generated on ${new Date().toLocaleString()}</p>
                <p>This report is confidential and intended for authorized personnel only.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return reportHTML;
  };

  const downloadReport = () => {
    const reportHTML = generateHTMLReport();
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURASCAN_Report_${candidateData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (onDownload) {
      onDownload();
    }
  };

  const printReport = () => {
    const reportHTML = generateHTMLReport();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AURASCAN AI Report - ${candidateData.name}`,
          text: `AI Analysis Report for ${candidateData.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-aura-blue-600" />
              Analysis Report Generator
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={shareReport}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" onClick={printReport}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={downloadReport} className="aura-gradient text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Preview */}
            <div className="border rounded-lg p-6 bg-gradient-to-br from-aura-blue-50 to-white">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-aura-gray-900 mb-2">
                  🧠 AURASCAN AI ANALYSIS REPORT
                </h2>
                <p className="text-aura-gray-600">
                  Advanced Candidate Assessment & Behavioral Analysis
                </p>
              </div>

              {/* Candidate Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-aura-blue-600" />
                    <span className="font-medium">Candidate:</span>
                    <span className="ml-2">{candidateData.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-aura-blue-600" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{candidateData.submissionDate || new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-aura-blue-600" />
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2">{candidateData.interviewDuration || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Brain className="mr-2 h-4 w-4 text-aura-blue-600" />
                    <span className="font-medium">Overall Score:</span>
                    <span className="ml-2 text-xl font-bold text-aura-blue-600">
                      {candidateData.analysis.personalityScore}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-green-600" />
                    <span className="font-medium">Trust Score:</span>
                    <span className="ml-2 text-lg font-semibold text-green-600">
                      {candidateData.analysis.trustScore}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="mr-2 h-4 w-4 text-orange-600" />
                    <span className="font-medium">Risk Level:</span>
                    <Badge className={`ml-2 ${getRiskColor(candidateData.analysis.riskLevel)}`}>
                      {candidateData.analysis.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Key Metrics Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-aura-gray-600">Communication</div>
                  <div className="text-lg font-bold text-aura-blue-600">
                    {candidateData.analysis.communicationSkills}%
                  </div>
                  <Progress value={candidateData.analysis.communicationSkills} className="h-2 mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-aura-gray-600">Technical</div>
                  <div className="text-lg font-bold text-aura-blue-600">
                    {candidateData.analysis.technicalAptitude}%
                  </div>
                  <Progress value={candidateData.analysis.technicalAptitude} className="h-2 mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-aura-gray-600">Leadership</div>
                  <div className="text-lg font-bold text-aura-blue-600">
                    {candidateData.analysis.leadershipPotential}%
                  </div>
                  <Progress value={candidateData.analysis.leadershipPotential} className="h-2 mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-aura-gray-600">Stress Handling</div>
                  <div className="text-lg font-bold text-aura-blue-600">
                    {candidateData.analysis.stressHandling}%
                  </div>
                  <Progress value={candidateData.analysis.stressHandling} className="h-2 mt-1" />
                </div>
              </div>

              {/* Report Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-1">✅ Strengths</h4>
                  <p className="text-green-700">{candidateData.analysis.strengths?.length || 0} identified strengths</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Development Areas</h4>
                  <p className="text-yellow-700">{candidateData.analysis.weaknesses?.length || 0} areas for improvement</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-1">💡 Recommendations</h4>
                  <p className="text-blue-700">{candidateData.analysis.recommendations?.length || 0} AI recommendations</p>
                </div>
              </div>
            </div>

            {/* Report Information */}
            <div className="bg-aura-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-aura-gray-900 mb-2">Report Features</h3>
              <ul className="space-y-1 text-sm text-aura-gray-700">
                <li>• Comprehensive candidate profile and contact information</li>
                <li>• Detailed personality and behavioral analysis</li>
                <li>• Skills assessment with visual progress indicators</li>
                <li>• AI-powered insights and recommendations</li>
                <li>• Professional formatting suitable for sharing</li>
                <li>• Print-friendly design for physical copies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;